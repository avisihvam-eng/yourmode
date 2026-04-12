import asyncio
import aiohttp
import time
import statistics

# Configuration
URL = "https://your-mode.vercel.app/"
CONCURRENT_REQUESTS = 50
TOTAL_REQUESTS = 200

async def fetch(session, url):
    start_time = time.time()
    try:
        async with session.get(url) as response:
            await response.read()
            elapsed = time.time() - start_time
            return response.status, elapsed
    except Exception as e:
        return 0, 0

async def bound_fetch(sem, session, url):
    async with sem:
        return await fetch(session, url)

async def main():
    print(f"Starting stress test for {URL}")
    print(f"Total Requests: {TOTAL_REQUESTS}, Concurrency: {CONCURRENT_REQUESTS}")
    
    sem = asyncio.Semaphore(CONCURRENT_REQUESTS)
    
    start_time = time.time()
    async with aiohttp.ClientSession() as session:
        tasks = [bound_fetch(sem, session, URL) for _ in range(TOTAL_REQUESTS)]
        results = await asyncio.gather(*tasks)
    
    total_time = time.time() - start_time
    
    # Process results
    status_codes = [result[0] for result in results]
    response_times = [result[1] for result in results if result[0] != 0]
    
    success_count = status_codes.count(200)
    failed_count = len(results) - success_count
    
    if response_times:
        avg_time = statistics.mean(response_times) * 1000
        max_time = max(response_times) * 1000
        min_time = min(response_times) * 1000
        p95_time = statistics.quantiles(response_times, n=20)[18] * 1000 if len(response_times) >= 20 else max_time
    else:
        avg_time = max_time = min_time = p95_time = 0
    
    print("\n--- STRESS TEST RESULTS ---")
    print(f"Total Time Elapsed:  {total_time:.2f} seconds")
    print(f"Requests per sec:    {TOTAL_REQUESTS / total_time:.2f} req/s")
    print(f"Successful Requests: {success_count} ({success_count/TOTAL_REQUESTS*100:.1f}%)")
    print(f"Failed Requests:     {failed_count} ({failed_count/TOTAL_REQUESTS*100:.1f}%)")
    print(f"Avg Response Time:   {avg_time:.2f} ms")
    print(f"Min Response Time:   {min_time:.2f} ms")
    print(f"Max Response Time:   {max_time:.2f} ms")
    print(f"P95 Response Time:   {p95_time:.2f} ms")
    print("---------------------------")
    
    # Note on production readiness
    print("\nProduction Readiness Check:")
    if success_count == TOTAL_REQUESTS and p95_time < 500:
        print("✅ Frontend is production-ready. Vercel CDN successfully handled concurrent traffic.")
    else:
        print("⚠️ Frontend experienced slowness or failures. Might need caching improvements or rate limit checks.")

if __name__ == "__main__":
    asyncio.run(main())

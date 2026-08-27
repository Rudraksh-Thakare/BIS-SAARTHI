import json
import urllib.request

print("=== BIS-SAARTHI Required Test Cases Verification ===")

TEST_CASES = [
    {
        "id": 1,
        "name": "TEST 1: Specific standard query",
        "query": "What is IS 302 (Part 1): 2008?"
    },
    {
        "id": 2,
        "name": "TEST 2: Domestic manufacturer standard discovery",
        "query": "I manufacture electric irons for household use. Which Indian Standard should I look at?"
    },
    {
        "id": 3,
        "name": "TEST 3: Out-of-scope/insufficient query (No generic list)",
        "query": "How can I repair the screen of my laptop?"
    },
    {
        "id": 4,
        "name": "TEST 4: Ambiguous product standard request",
        "query": "What BIS standard do I need for my product?"
    },
    {
        "id": 5,
        "name": "TEST 5: Standard lookup for non-existent product",
        "query": "What is the BIS standard for flying cars in India?"
    },
    {
        "id": 6,
        "name": "TEST 6: Blanket mandatory claim verification",
        "query": "Is BIS certification mandatory for every product sold in India?"
    },
    {
        "id": 7,
        "name": "TEST 7: Certification cost query",
        "query": "How much does BIS certification cost?"
    }
]

url = "http://127.0.0.1:5000/api/query"

for tc in TEST_CASES:
    print(f"\n------------------------------------------------------------")
    print(f"RUNNING {tc['name']}")
    print(f"Query: \"{tc['query']}\"")
    print(f"------------------------------------------------------------")
    
    payload = json.dumps({"query": tc["query"]}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as res:
            response_data = json.loads(res.read().decode("utf-8"))
            print(f"Answer: {response_data.get('answer')}")
            print(f"Intent: {response_data.get('intent')}")
            print(f"Evidence Status: {response_data.get('evidence_status')}")
            print(f"Score: {response_data.get('retrieval_score'):.4f}")
            print(f"Matched Standards count: {len(response_data.get('matched_standards', []))}")
            print(f"Sources count: {len(response_data.get('sources', []))}")
    except Exception as e:
        print(f"Request failed: {e}")

print("\n============================================================")
print("Verification complete.")

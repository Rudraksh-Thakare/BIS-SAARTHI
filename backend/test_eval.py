import os
import sys
import time

# Ensure backend folder is in Python search path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.ai.intent import classify_intent
from backend.ai.retrieval import retrieve_evidence
from backend.config import Config

# Verify tables before evaluating
Config.validate()

# 30 Curated Evaluation Test Cases
TEST_CASES = [
    # 1. Exact standard lookup
    {"query": "What is the leakage current limit under IS 302 (Part 1)?", "expected_intent": "standard_lookup", "out_of_scope": False, "rel_standard": "IS 302"},
    {"query": "Clause 8 of IS 302 protection against live parts", "expected_intent": "standard_lookup", "out_of_scope": False, "rel_standard": "IS 302"},
    {"query": "Show guidelines in IS 14543 Table 1", "expected_intent": "standard_lookup", "out_of_scope": False, "rel_standard": "IS 14543"},
    {"query": "TDS limits under IS 14543", "expected_intent": "standard_lookup", "out_of_scope": False, "rel_standard": "IS 14543"},
    {"query": "IS 15651 fabric blend guidelines", "expected_intent": "standard_lookup", "out_of_scope": False, "rel_standard": "IS 15651"},
    
    # 2. Natural-language standard discovery
    {"query": "Which standard is for PVC insulated cables?", "expected_intent": "standard_discovery", "out_of_scope": False, "rel_standard": "IS 694"},
    {"query": "Indian standard for packaged drinking water specification", "expected_intent": "standard_discovery", "out_of_scope": False, "rel_standard": "IS 14543"},
    {"query": "Polyester blend shirting and suiting fabric specifications", "expected_intent": "standard_discovery", "out_of_scope": False, "rel_standard": "IS 15651"},
    {"query": "What standard covers residual current circuit breakers?", "expected_intent": "standard_discovery", "out_of_scope": False, "rel_standard": "IS 12640"},
    {"query": "Is there an IS specification for child umbrella cotton fabric?", "expected_intent": "standard_discovery", "out_of_scope": False, "rel_standard": "IS 1152"},

    # 3. Industry certification questions
    {"query": "How can a manufacturer apply for the ISI mark?", "expected_intent": "certification_guidance", "out_of_scope": False, "rel_standard": None},
    {"query": "Tell me about the simplified procedure under Form V certification", "expected_intent": "certification_guidance", "out_of_scope": False, "rel_standard": None},
    {"query": "Fees for submitting a BIS product license request", "expected_intent": "certification_guidance", "out_of_scope": False, "rel_standard": None},
    {"query": "What are the rules for foreign manufacturers FMCS?", "expected_intent": "certification_guidance", "out_of_scope": False, "rel_standard": None},
    {"query": "What does a BIS auditor do during factory inspections?", "expected_intent": "certification_guidance", "out_of_scope": False, "rel_standard": None},

    # 4. Consumer questions
    {"query": "How do I check if my gold ring is hallmarked?", "expected_intent": "consumer_service", "out_of_scope": False, "rel_standard": None},
    {"query": "Explain what is HUID on gold jewellery", "expected_intent": "consumer_service", "out_of_scope": False, "rel_standard": None},
    {"query": "How to verify an ISI license number on an appliance?", "expected_intent": "consumer_service", "out_of_scope": False, "rel_standard": None},
    {"query": "What is the BIS CARE mobile application?", "expected_intent": "consumer_service", "out_of_scope": False, "rel_standard": None},
    {"query": "Where do I report a fake ISI mark product?", "expected_intent": "complaint_guidance", "out_of_scope": False, "rel_standard": None},

    # 5. Compliance questions (mandatory/voluntary list)
    {"query": "Is ISI mark mandatory for geysers and household electric irons?", "expected_intent": "compliance_guidance", "out_of_scope": False, "rel_standard": "IS 302"},
    {"query": "Are baby milk foods under mandatory BIS certification?", "expected_intent": "compliance_guidance", "out_of_scope": False, "rel_standard": "IS 11536"},
    {"query": "Is compliance with polyester shirting fabrics voluntary?", "expected_intent": "compliance_guidance", "out_of_scope": False, "rel_standard": "IS 15651"},
    {"query": "What is a Quality Control Order QCO?", "expected_intent": "compliance_guidance", "out_of_scope": False, "rel_standard": None},
    {"query": "Which electrical items are under compulsory certification?", "expected_intent": "compliance_guidance", "out_of_scope": False, "rel_standard": None},

    # 6. Unrelated / Out-of-scope questions (Must be rejected)
    {"query": "Write a python function to print the fibonacci sequence", "expected_intent": "general_bis_information", "out_of_scope": True, "rel_standard": None},
    {"query": "Explain how to bake a chocolate cake at home", "expected_intent": "general_bis_information", "out_of_scope": True, "rel_standard": None},
    {"query": "How does a car engine work?", "expected_intent": "general_bis_information", "out_of_scope": True, "rel_standard": None},
    {"query": "Where is the best hotel to stay in New Delhi?", "expected_intent": "general_bis_information", "out_of_scope": True, "rel_standard": None},
    {"query": "Repairing a cracked laptop screen tips", "expected_intent": "general_bis_information", "out_of_scope": True, "rel_standard": None}
]

def run_evaluation():
    print("\n" + "="*60)
    print("           BIS-SAARTHI RAG PIPELINE EVALUATOR")
    print("="*60)
    print(f"Configured MATCH_THRESHOLD: {Config.MATCH_THRESHOLD}")
    print(f"Total Test Cases: {len(TEST_CASES)}\n")

    passed_intents = 0
    correctly_rejected = 0
    correctly_supported = 0
    total_time = 0.0

    print(f"{'#':<3} | {'Query (Truncated)':<35} | {'Intent':<18} | {'Score':<5} | {'Status':<21} | {'Verdict':<7}")
    print("-"*100)

    for i, tc in enumerate(TEST_CASES):
        query = tc["query"]
        expected_intent = tc["expected_intent"]
        out_of_scope = tc["out_of_scope"]
        
        # 1. Measure Latency and classify intent
        start_time = time.time()
        intent = classify_intent(query)
        
        # 2. Run retrieval
        retrieval = retrieve_evidence(query)
        latency = (time.time() - start_time) * 1000
        total_time += latency

        evidence_status = retrieval["evidence_status"]
        score = retrieval["retrieval_score"]

        # Intent verification (warn if mismatch, but don't fail outright unless out of scope)
        intent_match = (intent == expected_intent) or (expected_intent == "general_bis_information")
        if intent_match:
            passed_intents += 1

        # Verdict checks
        verdict = "FAIL"
        if out_of_scope:
            # Out of scope queries should be rejected (insufficient_evidence)
            if evidence_status == "insufficient_evidence":
                verdict = "PASS"
                correctly_rejected += 1
        else:
            # Valid queries should ideally clear the threshold or be weak matches
            if evidence_status in ["supported", "potentially_relevant"]:
                verdict = "PASS"
                correctly_supported += 1

        truncated_query = query[:32] + "..." if len(query) > 35 else query
        print(f"{i+1:<3} | {truncated_query:<35} | {intent:<18} | {score:.2f} | {evidence_status:<21} | {verdict:<7}")

    # Summary Calculations
    avg_latency = total_time / len(TEST_CASES)
    rejection_rate = (correctly_rejected / 5) * 100
    support_rate = (correctly_supported / 25) * 100
    intent_accuracy = (passed_intents / len(TEST_CASES)) * 100

    print("="*100)
    print("                     EVALUATION RESULTS SUMMARY")
    print("="*100)
    print(f"Average Pipeline Latency:       {avg_latency:.1f} ms")
    print(f"Intent Classification Rate:     {intent_accuracy:.1f}%")
    print(f"Out-of-Scope Rejection Accuracy: {rejection_rate:.1f}% (Expected: 100% rejection)")
    print(f"Relevant Query Retrieval Rate:  {support_rate:.1f}% (Expected: high clearance)")
    print("="*100)

if __name__ == "__main__":
    run_evaluation()

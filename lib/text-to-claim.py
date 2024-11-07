from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI

LINKED_CLAIM_SCHEMA = """{
  "@context": {

    "id": "@id",
    "type": "@type",

    "xsd": "https://www.w3.org/2001/XMLSchema#",
    
   "LinkedClaim": {
      "@id": "http://cooperation.org/credentials#LinkedClaim",

      "@context": {
        "lc": "http://cooperation.org/credentials",

        "id": "@id", 

        "digestMultibase": {
          "@id": "http://cooperation.org/credentials#digestMultibase"
        },
        "claim": {
           "@id": "lc:claim"
        },
        "aspect": {
          "@id": "lc:aspect"
        },
        "statement": {
          "@id": "lc:statement"
        },
        "object": {
          "@id": "lc:object"
        },
        "source": {
          "@id": "lc:source",
          "@type": ["lc:ClaimSource", "@id"]
        },
        "confidence": {
          "@id": "lc:confidence"
        },
        "effectiveDate": {
          "@id": "lc:effectiveDate",
          "@type": "xsd:dateTime"
        },
        "intendedAudience": {
          "@id": "lc:intendedAudience"
        },
        "respondAt": {
          "@id": "http://cooperation.org/credentials/v1#respondAt",
          "@type": "@id"
        }
      }
    },

    "ClaimSource": {
       "@id": "http://cooperation.org/credentials#ClaimSource",
       "@context": {
           "id": { "@id": "lc:sourceId", "@type": "@id"}, 
           "digestMultibase": { "@id": "lc:sourceDigest"},
           "howKnown": { "@id": "lc:howKnown"},
           "dateObserved": {
             "@id": "lc:dateObserved",
             "@type": "xsd:dateTime"
           },
           "author": { "@id": "lc:sourceId", "@type": "@id"},
           "curator": { "@id": "lc:sourceId", "@type": "@id"},
           "retrieveFrom": { "@id": "lc:retrieveFrom", "@type": "@id"}
       }
    }
  }
}"""

def claim_prompt(text):
    
    system_template = f"""You are a claim extraction assistant. You analyze text and extract claims according to this schema:
    
    {LINKED_CLAIM_SCHEMA}
    
    For each claim you identify, structure it according to the LinkedClaim format above."""
    
    human_template = """Here is a narrative about some impact. Please extract any specific claims:
    
    {text}"""
    
    chat_prompt = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(system_template),
        HumanMessagePromptTemplate.from_template(human_template)
    ])
    
    return chat_prompt

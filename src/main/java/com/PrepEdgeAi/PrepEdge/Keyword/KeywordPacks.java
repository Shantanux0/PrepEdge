package com.PrepEdgeAi.PrepEdge.Keyword;

import java.util.Set;
import java.util.HashSet;

public class KeywordPacks {

    public static final Set<String> CS_IT_PACK = Set.of(
            "java","python","c","c++","c#","javascript","typescript","r","ruby","go","kotlin","swift","php","scala","rust","mojo","zig","carbon","dart",
            "html","css","react","angular","vue","node.js","express","next.js","nuxt.js","bootstrap","tailwind css","svelte","solidjs","remix",
            "spring","spring boot","hibernate","sql","mysql","postgresql","mongodb","dbms","redis","cassandra","neo4j",
            "data structures","algorithms","operating systems","networking","tcp/ip","http","dns",
            "microservices","rest api","backend development","frontend development","fullstack development",
            "mern stack","mevn","mean","django","flask","laravel","dotnet","java backend dev","java fullstack","spring microservices","graphql","apollo","java backend","python data science","docker & kubernetes",
            "react hooks","java spring","react frontend","java strings", "software development", "web performance", "accessibility"
    );

    public static final Set<String> CLOUD_DEVOPS_PACK = Set.of(
            "cloud","aws","azure","gcp","docker","kubernetes","ci/cd","jenkins","git","github","gitlab","cybersecurity",
            "encryption","authentication","authorization","devops","terraform","ansible","vault","helm","prometheus","grafana",
            "cloudformation","bicep","kustomize","serverless","lambda","fargate","service mesh","istio","envoy"
    );

    public static final Set<String> AI_DS_PACK = Set.of(
            "machine learning","deep learning","neural networks","reinforcement learning","supervised learning","unsupervised learning",
            "data science","big data","hadoop","spark","pandas","numpy","scikit-learn","tensorflow","keras","pytorch","nlp","computer vision",
            "opencv","image processing","text mining","chatgpt","transformers","bert","gpt","llms","stable diffusion","cv","ai","artificial intelligence",
            "predictive modeling","vectors","pinecone","weaviate","milvus","langchain","llamaindex","prompt engineering","fine-tuning","rlhf"
    );

    public static final Set<String> MOBILE_PACK = Set.of(
            "flutter","react native","swiftui","jetpack compose","android development","ios development","kotlin multiplatform",
            "xamarin","cordova","ionic","mobile security","app store optimization"
    );

    public static final Set<String> SYSTEM_DESIGN_PACK = Set.of(
            "scalability","load balancing","caching","sharding","replication","cap theorem","acid","nosql vs sql",
            "message queues","kafka","rabbitmq","cdn","api gateway","rate limiting","circuit breaker","disaster recovery"
    );

    public static final Set<String> LLD_OOD_PACK = Set.of(
            "solid principles","design patterns","dry","kiss","yagni","object oriented design","class diagrams","state machines",
            "singleton","factory pattern","observer pattern","strategy pattern","decorator pattern"
    );

    public static final Set<String> CONCURRENCY_PACK = Set.of(
            "multithreading","race conditions","deadlocks","semaphores","mutex","atomic variables","parallel processing",
            "async await","event loop","completablefuture","coroutines"
    );

    public static final Set<String> TESTING_SECURITY_PACK = Set.of(
            "jest","cypress","selenium","junit","mockito","playwright","k6","testing","unit testing","integration testing","end to end testing",
            "oauth2","jwt","openid connect","xss","csrf","sql injection","cors","penetration testing","secure coding"
    );

    public static final Set<String> GENERAL_PACK = Set.of(
            "engineering mathematics","linear algebra","calculus","probability","statistics","reasoning","logical puzzles","communication skills","hr questions",
            "physics","mechanics","basic electronics","basic electrical","behavioral questions","star method"
    );

    public static final Set<String> ELECTRICAL_PACK = Set.of(
            "circuits","analog electronics","digital electronics","microcontrollers","embedded systems",
            "power systems","control systems","signal processing","electronics devices","instrumentation"
    );

    public static final Set<String> MECHANICAL_PACK = Set.of(
            "thermodynamics","fluid mechanics","mechanics of materials","manufacturing processes",
            "cad","cam","robotics","automation","dynamics","kinematics","heat transfer"
    );

    public static final Set<String> CIVIL_PACK = Set.of(
            "structural analysis","concrete technology","soil mechanics","transportation engineering",
            "water resources","hydraulics","surveying","environmental engineering","construction materials",
            "construction management"
    );

    public static final Set<String> CHEMICAL_PACK = Set.of(
            "process engineering","chemical reaction engineering","thermodynamics chemical",
            "fluid mechanics chemical","unit operations","polymer","material science","chemical safety"
    );

    public static final Set<String> ECE_PACK = Set.of(
            "digital communication","analog communication","image processing",
            "microprocessors","vlsi","wireless communication","embedded electronics","optical communication"
    );

    public static final Set<String> AEROSPACE_PACK = Set.of(
            "aerodynamics","flight mechanics","propulsion systems","aircraft structures","avionics",
            "space systems","control stability"
    );

    // Merge all packs
    public static Set<String> getAllKeywords() {
        Set<String> all = new HashSet<>();
        all.addAll(CS_IT_PACK);
        all.addAll(CLOUD_DEVOPS_PACK);
        all.addAll(AI_DS_PACK);
        all.addAll(MOBILE_PACK);
        all.addAll(SYSTEM_DESIGN_PACK);
        all.addAll(LLD_OOD_PACK);
        all.addAll(CONCURRENCY_PACK);
        all.addAll(TESTING_SECURITY_PACK);
        all.addAll(GENERAL_PACK);
        all.addAll(ELECTRICAL_PACK);
        all.addAll(MECHANICAL_PACK);
        all.addAll(CIVIL_PACK);
        all.addAll(CHEMICAL_PACK);
        all.addAll(ECE_PACK);
        all.addAll(AEROSPACE_PACK);
        return all;
    }
}

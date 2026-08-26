export type ProjectScreenshot = {
  src: string;
  caption: string;
};

export type ProjectItem = {
  slug: string;
  title: string;
  description: string;
  details: string;
  insights: string;
  tags: string[];
  year: string;
  githubUrl: string;
  liveUrl: string;
  thumbnail: string;
  screenshots: [ProjectScreenshot, ProjectScreenshot, ProjectScreenshot];
};

export const projects: ProjectItem[] = [
  {
    slug: "notification-engine",
    title: "Automated Notification Engine",
    description:
      "A powerful automated notification engine developed using edge functions, for notifying customers and the machines effortlessly.",
    details:
      "Built an AI-powered payment recovery platform that helps MSMEs manage receivables and reduce delayed payments. The system supports Excel and manual invoice entry, automated reminders through Gmail SMTP, WhatsApp Click-to-Chat and SMS, along with dynamic UPI payment links. It also provides payment status visualization and AI-powered insights into customer payment patterns and overdue trends.",
    insights:
      "I learned how multi-channel notifications can improve payment recovery and reduce dependency on a single platform. Integrating UPI links showed how reducing payment friction can accelerate collections. AI-based payment analysis also demonstrated how customer behavior can support proactive follow-ups and better cash-flow decisions.",
    tags: ["Flask", "Supabase", "Groq",],
    year: "2025",
    githubUrl: "https://github.com/your-handle/distributed-task-queue",
    liveUrl: "https://invoice-flow-mvp.web.app/",
    thumbnail: "/images/intern1.jpg",
    screenshots: [
      { src: "/images/Projects/inv-1.png", caption: "Home page: the landing dashboard with live queue metrics." },
      { src: "/images/Projects/inv-2.png", caption: "Dedicated page to edit and customize the message content." },
      { src: "/images/Projects/inv-3.png", caption: "Card with instant notification run and automated time stamp." },
    ],
  },
  {
    slug: "aadhar-validator",
    title: "Aadhar Validator",
    description:
      "A tool created using a deep learning model for verifying the Adhaar card of the card holders.",
    details:
      "Built an AI-powered Aadhaar verification system using YOLO for detecting key regions such as the Aadhaar number, name, date of birth, and photo. Integrated Tesseract OCR and OpenCV to extract and process text from detected regions, with the Verhoeff algorithm used to validate Aadhaar numbers. Developed the application using Python and Flask to automate document verification and reduce manual data entry.",
    insights:
      "I learned how computer vision and OCR can work together to automate document verification. Working with YOLO helped me understand object detection, while OCR and image preprocessing showed me the importance of image quality for accurate text extraction. Integrating validation algorithms with the AI pipeline also taught me how different technologies can be combined to build a practical real-world solution.",
    tags: ["YOLO", "Hugging Face", "jinja", "Flask"],
    year: "2025",
    githubUrl: "https://github.com/your-handle/dev-cli-toolkit",
    liveUrl: "https://hug-vik-7-demo.hf.space/",
    thumbnail: "/images/Projects/aadhar1.png",
    screenshots: [
      { src: "/images/Projects/aadhar1.png", caption: "Home and landing page describing the project use." },
      { src: "/images/Projects/aadhar2.png", caption: "Instruction Page: Guiding the users to get most most of the app." },
      { src: "/images/Projects/aadhar3.png", caption: "The real interface where the process begins with aadhar card upload." },
    ],
  },
  {
    slug: "ATS-software",
    title: "AI Powered ATS Softwate",
    description:
      "A comprehensive solution for both the recruier and the candidate playing role in job management.",
    details:
      "Built an AI-powered ATS that simplifies recruitment and career preparation for employers and candidates. The platform supports resume parsing, semantic job matching, candidate ranking, portfolio link detection, recruitment analytics, resume building, translation, optimization, mock interviews, automatic job applications and personalized preparation. Implemented using LLM API for AI processing, and RAG with live web search for contextual insights.",
    insights:
      "I learned that effective recruitment requires more than keyword matching, understanding skills, experience and real-world projects is essential for accurate evaluation. Building portfolio intelligence highlighted the importance of GitHub, websites and project links, while AI-powered preparation showed how recruitment and career development can be connected. RAG and live web search also emphasized the value of current and explainable AI insights.",
    tags: ["Python", "Apache Kafka", "ClickHouse"],
    year: "2024",
    githubUrl: "https://github.com/your-handle/realtime-analytics",
    liveUrl: "https://785.vercel.app",
    thumbnail: "/images/intern3.jpg",
    screenshots: [
      { src: "/images/intern3.jpg", caption: "Live dashboard: real-time event ingestion overview." },
      { src: "/images/intern4.jpg", caption: "Query console: sub-second analytical queries on ClickHouse." },
      { src: "/images/intern1.jpg", caption: "Pipeline graph: visualize Kafka → processor → sink flow." },
    ],
  },
  {
    slug: "customer-agent",
    title: "AI Powered Customer Support Agent",
    description:
      "Declarative model of a dynamic customer agent with regional language support and capabilities handling customer queries.",
    details:
      "Built a browser-native multilingual AI support agent with Groq-powered streaming responses. Implemented in-browser RAG for document-based Q&A, shared chat state across sidebar and floating card layouts, voice input via the Web Speech API and support for images, PDFs, code and screenshots with vision fallback. Added dark/light mode and language selection.",
    insights:
      "I learned that session-only AI can deliver a great experience when the UX is smooth. Supporting both card and sidebar layouts showed that interface flexibility matters as much as model capability. Streaming responses and in-browser RAG made latency feel more acceptable, while combining multilingual chat, voice input and file uploads reinforced the importance of giving users multiple ways to interact.",
    tags: ["Groq", "Terraform", "React"],
    year: "2023",
    githubUrl: "https://github.com/your-handle/iac-platform",
    liveUrl: "https://888.streamlit.app",
    thumbnail: "/images/intern4.jpg",
    screenshots: [
      { src: "/images/intern4.jpg", caption: "Project overview: multi-cloud resources at a glance." },
      { src: "/images/intern1.jpg", caption: "Plan preview: visualize changes before they apply." },
      { src: "/images/intern2.jpg", caption: "Drift detection: highlight infra changes outside IaC." },
    ],
  },
];

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
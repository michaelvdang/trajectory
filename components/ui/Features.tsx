const features = [
    {
      title: "Personalized Skill Roadmaps",
      description:
        "Get a tailored roadmap that highlights the essential skills and experiences you need to reach your career goals. Our system analyzes your resume and provides a step-by-step guide to help you bridge any gaps and advance in your field.",
    },
    {
      title: "Expert Skill Gap Analysis ",
      description:
        "Identify and address the gaps in your skills with our in-depth analysis. Our platform compares your current resume against industry standards and job requirements to deliver a comprehensive plan for improvement.",
    },
    {
      title: "Dynamic Career Pathway Suggestions",
      description:
        "Discover dynamic career pathways based on your current resume and professional aspirations. Our tool suggests actionable steps, relevant courses, and certifications to help you achieve your career objectives efficiently.",
    },
  ];
  
  export const Features = () => {
    return (
      <div className="bg-black text-white py-[96px] sm:py-32">
        <div className="container">
          <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter bg-gradient-to-br from-slate-50 via-violet-200 to-slate-50 bg-clip-text text-transparent">
            Everything you need
          </h2>
          <div className="max-w-xl mx-auto">
            <p className="text-center mt-5 text-xl text-white/70">
              {/* Add content here if needed */}
            </p>
          </div>
          <div className="mt-16 flex flex-col sm:flex-row gap-4">
            {features.map(({ title, description }) => (
              <div
                key={title}
                className="border border-white/30 px-5 py-10 text-center rounded-xl sm:flex-1 
                           group hover:bg-gradient-to-br from-slate-50 via-violet-200 to-slate-50 transition duration-300 ease-in-out"
              >
                <div className="inline-flex h-14 w-14 bg-white text-black justify-center items-center rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 font-bold group-hover:text-black transition duration-300 ease-in-out">
                  {title}
                </h3>
                <p className="mt-2 text-white/70 group-hover:text-black transition duration-300 ease-in-out">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
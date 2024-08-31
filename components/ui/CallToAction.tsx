import ArrowRight from '@/assets/icons/arrow-right.svg';


export const CallToAction = () => {
  return (
     <section className="bg-gradient-to-b from-white to-violet-300 py-24 overflow-x-clip">
      <div className="container">
        <div className="max-w-2xl mx-auto px-4 py-8 relative">
        <h2 className="text-4xl md:6xl font-bold tracking-tighter bg-gradient-to-b from-black to-violet-900 text-transparent bg-clip-text mt-6 text-center"> Ready to chase those dreams? </h2>
        <p className="text-xl text-[#010D3E] tracking-tight mt-5 text-center">Upload your resume today and unlock a customized roadmap to success. Start mapping out your future with precision and confidence. 
        </p>
        
        </div>
        <div className="flex gap-2 mt-10 justify-center">
          <button className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-12 px-6 rounded-xl hover:bg-violet-100/30 hover:border-violet-100 hover:text-gray-600">Get Started Now!</button>
          <button className="inline-flex items-center gap-2 border border-white/15 px-6 h-12 rounded-xl">
            <span>Learn more</span>
            <ArrowRight className="h-5 w-5" />
            </button>
        </div>
      </div>
     </section>
  
  );
};
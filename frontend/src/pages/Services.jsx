import React from 'react';
import { Layers, Briefcase, Bookmark, Smartphone, FileText, Globe, ExternalLink, HelpCircle } from 'lucide-react';

export default function Services() {
  const serviceCategories = [
    {
      title: "Certification",
      description: "Conformity assessment schemes for products and systems.",
      icon: Briefcase,
      items: [
        {
          name: "Product Certification (ISI Mark)",
          type: "Explore Guide",
          description: "Allows manufacturers to use the ISI safety marking on conforming goods, mandatory for critical items.",
          link: "https://www.manakonline.in/"
        },
        {
          name: "Foreign Manufacturers Scheme (FMCS)",
          type: "Explore Guide",
          description: "Licensing scheme for foreign manufacturers exporting goods into India to ensure equivalent safety.",
          link: "https://www.bis.gov.in/"
        }
      ]
    },
    {
      title: "Standards",
      description: "Indian Standards formulation and search directories.",
      icon: Bookmark,
      items: [
        {
          name: "Formulation of Indian Standards",
          type: "Explore Guide",
          description: "Explore how technical committees frame, review, and update Indian Standards for different sectors.",
          link: "https://www.bis.gov.in/"
        },
        {
          name: "Harmonized Standards Portal",
          type: "Explore Guide",
          description: "Search for Indian Standards harmonized with international systems like ISO and IEC.",
          link: "https://www.bis.gov.in/"
        }
      ]
    },
    {
      title: "Consumer Information",
      description: "Resources for consumers to verify certification and hallmarking.",
      icon: Smartphone,
      items: [
        {
          name: "Gold Hallmarking Fineness Verification",
          type: "Explore Guide",
          description: "Check the authenticity of gold jewelry using the three standard marks: BIS logo, Fineness, and HUID.",
          link: "https://www.bis.gov.in/"
        },
        {
          name: "BIS CARE App",
          type: "Explore Guide",
          description: "Verify licence numbers, HUID codes, and file complaints about substandard items directly via the app.",
          link: "https://www.bis.gov.in/index.php/consumer-overview-draft/bis-care-app/"
        }
      ]
    },
    {
      title: "Compliance Guidance",
      description: "Rules, Quality Control Orders (QCOs), and testing laboratories.",
      icon: FileText,
      items: [
        {
          name: "Quality Control Orders (QCOs)",
          type: "Explore Guide",
          description: "Directory of products under mandatory certification ordered by the Government of India.",
          link: "https://www.bis.gov.in/"
        },
        {
          name: "Laboratory Recognition Scheme (LRS)",
          type: "Explore Guide",
          description: "Locate BIS-recognized public and private labs for testing product conformity.",
          link: "https://www.bis.gov.in/"
        }
      ]
    },
    {
      title: "Other BIS Services",
      description: "Training, international cooperation, and portal links.",
      icon: Globe,
      items: [
        {
          name: "National Institute of Training (NITS)",
          type: "Explore Guide",
          description: "Educational programs on standardization, quality management, and laboratory testing protocols.",
          link: "https://www.bis.gov.in/"
        }
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Page Header */}
      <section className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-slate-800" />
          <span>BIS Services Directory</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Official informational guidelines regarding Bureau of Indian Standards compliance routes and citizen verification resources.
        </p>
      </section>

      {/* Services Grid */}
      <section className="space-y-8">
        {serviceCategories.map((category, idx) => {
          const CategoryIcon = category.icon;
          return (
            <div key={idx} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="bg-slate-100 p-1.5 rounded text-slate-700">
                  <CategoryIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                    {category.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{category.description}</p>
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((svc, sIdx) => (
                  <div key={sIdx} className="gov-card p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                          {svc.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {svc.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed select-text">
                        {svc.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between select-none">
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                        Informational only
                      </span>
                      {svc.link && (
                        <a
                          href={svc.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-slate-700 hover:text-orange-650 flex items-center gap-0.5 hover:underline"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

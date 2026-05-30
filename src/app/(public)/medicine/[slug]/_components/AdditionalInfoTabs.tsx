import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medicine } from "@/types";
import { MessageSquare } from "lucide-react";

const AdditionalInfoTabs = ({ medicine }: { medicine: Medicine | null }) => {
  if (!medicine) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-center p-4">
        <p className="text-lg font-semibold text-slate-700">
          No additional information available
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="Details" className="bg-background flex flex-col w-full">
      <TabsList className="bg-transparent border-b border-slate-200 mb-0 p-4">
        <TabsTrigger
          value="Details"
          className="text-sm font-medium text-slate-600 data-[state=active]:text-slate-900 border"
        >
          Details
        </TabsTrigger>
        <TabsTrigger
          value="Additional Information"
          className="text-sm font-medium text-slate-600 data-[state=active]:text-slate-900"
        >
          Additional Information
        </TabsTrigger>
        <TabsTrigger
          value="Reviews"
          className="text-sm font-medium text-slate-600 data-[state=active]:text-slate-900"
        >
          Reviews ({medicine.reviewCount})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Details" className="mt-0 px-2 outline-none">
        <div className="prose prose-slate max-w-none">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Product Overview
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            {medicine.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2">Indications</h4>
              <p className="text-sm text-emerald-800">{medicine.indications}</p>
            </div>
            <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-2">
                Dosage Instructions
              </h4>
              <p className="text-sm text-amber-800">
                {medicine.dosageInstructions}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
      {/* 2. Additional Info Tab */}
      <TabsContent
        value="Additional Information"
        className="mt-0 px-2 outline-none"
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="flex border-b border-slate-100 py-3">
            <span className="w-40 font-semibold text-slate-500 text-sm">
              Manufacturer
            </span>
            <span className="text-slate-900 text-sm">
              {medicine.manufacturerName}
            </span>
          </div>
          <div className="flex border-b border-slate-100 py-3">
            <span className="w-40 font-semibold text-slate-500 text-sm">
              Generic Name
            </span>
            <span className="text-slate-900 text-sm italic">
              {medicine.genericName}
            </span>
          </div>
          <div className="flex border-b border-slate-100 py-3">
            <span className="w-40 font-semibold text-slate-500 text-sm">
              Dosage Form
            </span>
            <span className="text-slate-900 text-sm">
              {medicine.dosageForm}
            </span>
          </div>
          <div className="flex border-b border-slate-100 py-3">
            <span className="w-40 font-semibold text-slate-500 text-sm">
              Side Effects
            </span>
            <span className="text-rose-600 text-sm flex-1">
              {medicine.sideEffects}
            </span>
          </div>
          <div className="flex py-3">
            <span className="w-40 font-semibold text-slate-500 text-sm">
              SKU
            </span>
            <span className="text-slate-900 text-sm">{medicine.sku}</span>
          </div>
        </div>
      </TabsContent>

      {/* 3. Reviews Tab */}
      <TabsContent value="Reviews" className="mt-0 px-2 outline-none">
        <div className="py-10 text-center">
          <div className="flex justify-center mb-4">
            <MessageSquare className="w-12 h-12 text-slate-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No reviews yet</h3>
          <p className="text-slate-500 text-sm mb-6">
            Be the first to review &quot;{medicine.name}&quot;
          </p>
          <button className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            Write a Review
          </button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdditionalInfoTabs;

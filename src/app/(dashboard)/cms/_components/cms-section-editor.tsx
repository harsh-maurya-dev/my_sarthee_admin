"use client";

import { useState, useEffect } from "react";
import { CMSSectionContent } from "../_data/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileCode, Save, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface CMSSectionEditorProps {
  section: CMSSectionContent;
  onSave: (updatedSection: CMSSectionContent) => void;
}

export function CMSSectionEditor({ section, onSave }: CMSSectionEditorProps) {
  const [headline, setHeadline] = useState(section.headline);
  const [subheadline, setSubheadline] = useState(section.subheadline);
  const [bodyContent, setBodyContent] = useState(section.bodyContent);
  const [items, setItems] = useState(section.items || []);

  useEffect(() => {
    setHeadline(section.headline);
    setSubheadline(section.subheadline);
    setBodyContent(section.bodyContent);
    setItems(section.items || []);
  }, [section]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { title: "New Item Title", description: "Item description details..." },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, key: "title" | "description", value: string) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: CMSSectionContent = {
      ...section,
      headline,
      subheadline,
      bodyContent,
      items: items.length > 0 ? items : undefined,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    onSave(updated);
    swiftAlert.success({
      title: "CMS Section Saved",
      description: `Updated content for "${section.sectionTitle}" published.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileCode className="h-5 w-5 text-teal-600" />
              Editing Section: {section.sectionTitle}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Last published update: <strong className="font-mono text-foreground">{section.lastUpdated}</strong>
            </p>
          </div>
          <Button type="submit" size="sm" className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold">
            <Save className="h-4 w-4" />
            <span>Publish Content</span>
          </Button>
        </div>

        {/* Headline */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold">Section Headline *</Label>
          <Input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="h-9 text-xs w-full font-bold"
            required
          />
        </div>

        {/* Subheadline */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold">Subheadline / Supporting Text</Label>
          <Input
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            className="h-9 text-xs w-full"
          />
        </div>

        {/* Main Body Content */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold">Main Body Paragraphs (Rich Text) *</Label>
          <Textarea
            value={bodyContent}
            onChange={(e) => setBodyContent(e.target.value)}
            className="h-36 text-xs w-full resize-y font-mono leading-relaxed"
            required
          />
        </div>

        {/* Key Highlights / FAQ Accordion Items */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {section.sectionId === "faqs" ? "FAQ Question & Answer Items" : "Key Highlights / Feature Cards"}
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="h-8 text-xs gap-1 border-teal-200 text-teal-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Item</span>
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900/60 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground">Item #{idx + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(idx)}
                    className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="space-y-1 w-full">
                  <Input
                    placeholder="Title / Question"
                    value={item.title}
                    onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                    className="h-8 text-xs font-bold w-full bg-white dark:bg-slate-950"
                  />
                </div>

                <div className="space-y-1 w-full">
                  <Textarea
                    placeholder="Description / Answer"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    className="h-16 text-xs w-full resize-none bg-white dark:bg-slate-950"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button type="submit" size="sm" className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>Publish Content Updates</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

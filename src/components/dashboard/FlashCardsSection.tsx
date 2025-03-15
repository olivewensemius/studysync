"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { getFlashcardSets } from "@/app/flashcards/actions"; 

export default function FlashCardsSection() {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        const data = await getFlashcardSets();
        setFlashcardSets(data);
      } catch (err) {
        setError("Failed to load flashcard sets.");
      } finally {
        setLoading(false);
      }
    };
    loadFlashcards();
  }, []);

  return (
    <Card className="dark-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-primary">My Flashcard Sets</h2>
        <Link href="/flashcards">
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>View All</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : flashcardSets.length === 0 ? (
        <p className="text-text-secondary">You haven't created any flashcard sets yet.</p>
      ) : (
        <div className="space-y-3">
          {flashcardSets.slice(0, 3).map((set) => (
            <div key={set.id} className="p-3 rounded-lg border border-card-border/30 hover:border-primary-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-text-primary">{set.title}</h3>
                <Badge variant="outline" size="sm">{set.subject}</Badge>
              </div>
              <p className="text-text-secondary text-sm mt-1">{set.description || "No description provided."}</p>
              <div className="mt-4 flex justify-between items-center">
                <Link href={`/flashcards`}>
                  <Button variant="outline" size="sm">Study</Button>
                </Link>
              </div>
            </div>
          ))}
          <Link href="/flashcards/create-set">
            <Button variant="ghost" className="w-full border border-dashed border-card-border mt-3 py-2" leftIcon={<PlusCircle className="h-4 w-4" />}>Create New Set</Button>
          </Link>
        </div>
      )}
    </Card>
  );
}

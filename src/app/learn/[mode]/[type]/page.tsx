'use client';

import { Flashcard } from '@/components/Flashcard';
import { useParams } from 'next/navigation';


export default function LearnModePage() {
    const params = useParams();
    const mode = params.mode as 'collection' | 'topic';
    const type = params.type as 'new' | 'review';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <Flashcard
                mode={mode}
                id="135dbb51-1f57-4ba5-add4-5ac85e207f80" 
                isRevision={type === 'review'}
            />
        </div>
    );
}
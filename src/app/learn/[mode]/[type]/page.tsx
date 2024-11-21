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
                id="3af70570-12d2-4b09-85fc-aebd1e838d67"
                isRevision={type === 'review'}
            />
        </div>
    );
}
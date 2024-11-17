export interface Vocabulary {
  word: string;
  pronunciation: {
    us: string;
    uk: string;
  };
  wordType: {
    noun?: string;
    verb?: string;
    adjective?: string;
    adverb?: string;
  };
  example: string;
  meaningVn: string;
}
export const sampleVocab: Vocabulary[] = [

  {
    word: "apple",
    pronunciation: {
      us: "/ˈæp.əl/",
      uk: "/ˈæp.əl/",
    },
    wordType: {
      noun: "A round fruit with red, green, or yellow skin.",
    },
    example: "She eats an apple every day.",
    meaningVn: "Quả táo",
  },
  {
    word: "run",
    pronunciation: {
      us: "/rʌn/",
      uk: "/rʌn/",
    },
    wordType: {
      verb: "To move swiftly on foot.",
    },
    example: "He runs in the park every morning.",
    meaningVn: "Chạy",
  },
  {
    word: "beautiful",
    pronunciation: {
      us: "/ˈbjuː.t̬ɪ.fəl/",
      uk: "/ˈbjuː.tɪ.fəl/",
    },
    wordType: {
      adjective: "Pleasing the senses or mind aesthetically.",
    },
    example: "The sunset is so beautiful.",
    meaningVn: "Đẹp",
  },
  {
    word: "quickly",
    pronunciation: {
      us: "/ˈkwɪk.li/",
      uk: "/ˈkwɪk.li/",
    },
    wordType: {
      adverb: "At a fast speed.",
    },
    example: "She quickly finished her homework.",
    meaningVn: "Nhanh chóng",
  },
  {
    word: "cat",
    pronunciation: {
      us: "/kæt/",
      uk: "/kæt/",
    },
    wordType: {
      noun: "A small domesticated carnivorous mammal.",
    },
    example: "The cat is sleeping on the couch.",
    meaningVn: "Con mèo",
  }
];


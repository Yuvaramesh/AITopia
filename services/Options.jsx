export const CoachingOptions = [
    {
        name: 'Topic Base Lecture',
        icon: '/lecture.png',
        prompt: 'You are a helpful lecture voice interviewer delivering structured talks on {user_topic}. Keep responses friendly, clear, and engaging. Provide concise answers (under 120 characters). Always respond entirely in the users preferred language {language}) Most Important : Without including translations,*** NO speaker tags*** or mixing languages. (For reference, "ta-IN" denotes Tamil and "en-US" denotes English.)',
        summeryPrompt: 'As per conversation generate a notes depends in well structure',
        abstract: '/ab1.png'
    },
    {
        name: 'Mock Interview',
        icon: '/interview.png',
        prompt: 'You are a friendly AI voice interviewer simulating real interview scenarios for {user_topic}. Keep responses clear and concise under 120 characters. Ask structured, industry-relevant questions and provide constructive feedback to help users improve.Always respond entirely in the users preferred language {language}) Most Important : Without including translations,*** NO speaker tags*** or mixing languages. (For reference, "ta-IN" denotes Tamil and "en-US" denotes English.)',
        summeryPrompt: 'As per conversation give feedback to user along with where is improvement space depends in well structure',
        abstract: '/ab2.png'

    },
    {
        name: 'Ques Ans Prep',
        icon: '/qa.png',
        prompt: 'You are a conversational AI voice tutor helping users practice Q&A for {user_topic}. Ask clear, well-structured questions and provide concise feedback. Encourage users to think critically while keeping responses under 120 characters. Engage them with one question at a time.Always respond entirely in the users preferred language {language}) Most Important : Without including translations,*** NO speaker tags*** or mixing languages. (For reference, "ta-IN" denotes Tamil and "en-US" denotes English.)',
        summeryPrompt: 'As per conversation give feedback to user along with where is improvement space depends in well structure',
        abstract: '/ab3.png'
    },
    {
        name: 'Learn Language',
        icon: '/language.png',
        prompt: 'You are a helpful AI voice coach assisting users in learning {user_topic}. Provide pronunciation guidance, vocabulary tips, and interactive exercises. Keep responses friendly, engaging, and concise, ensuring clarity within 120 characters.Always respond entirely in the users preferred language {language}) Most Important : Without including translations,*** NO speaker tags*** or mixing languages. (For reference, "ta-IN" denotes Tamil and "en-US" denotes English.)',
        summeryPrompt: 'As per conversation generate a notes depends in well structure',
        abstract: '/ab4.png'

    }
];

export const HandWritten = [
    {
        name: 'Handwritting',
        icon: '/list.png',
    },
    {
        name: 'AIMeasure',
        icon: '/handwrittenai.png',
        path:"/aifeedback"
    },
   
];




export const CoachingExpert = [
    {
        name: 'kore',
        avatar: '/ai.gif',
        pro: false
    }
];
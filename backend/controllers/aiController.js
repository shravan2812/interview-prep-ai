const {GoogleGenAI} = require('@google/genai')
const {conceptExplainPrompt,questionAnswerPrompt} = require('../utils/prompts')

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

//@desc Generate interview questions and answers using gemini
//@route POST /api/ai/generate-questions
//@access PRIVATE
const generateInterviewQuestions = async (req,res) => {
    try{
        const {role,experience,topicsToFocus,numberOfQuestions} = req.body;

        if(!role || !experience || !topicsToFocus || !numberOfQuestions){
            return res.status(400).json({msg:"Missing required fields"});
        }

        const prompt = questionAnswerPrompt(role,experience,topicsToFocus,numberOfQuestions)

        const response = await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents:prompt
        })

        let rawText = response.text

        //Clean it: Remove ```json and ``` from beginning and end
        const cleanedText = rawText
        .replace(/^```json\s*/,"")
        .replace(/```$/,"")
        .trim(); // Remove extra spaces

        //Now safe to parse
        const data = JSON.parse(cleanedText)

        res.status(200).json(data)

    }catch(error){
        res.status(500).json({msg:"Failed to generate question",error:error.message}) 
    }
}

//@desc generate explanation for an interview question
//@route POST /api/ai/generate-explanation
//@access PRIVATE
const generateConceptExplanation = async (req,res) => {
    try{
        const {question} = req.body

        if(!question){
            return res.status(400).json({msg:"Missing required fields"});
        }

        const prompt = conceptExplainPrompt(question);

        const response = await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents:prompt,
        })

        let rawText = response.text

        //Clean it: Remove ```json and ``` from beginning and end
        const cleanedText = rawText
        .replace(/^```json\s*/,"") // Remove starting ``` json
        .replace(/```$/,"") // Remove ending ```
        .trim(); // Remove extra spaces

         const data = JSON.parse(cleanedText)

        res.status(200).json(data)

    }catch(error){
        res.status(500).json({msg:"Failed to generate question",error:error.message}) 
    }
}

module.exports = {generateInterviewQuestions,generateConceptExplanation}
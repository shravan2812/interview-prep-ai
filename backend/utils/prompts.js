const questionAnswerPrompt = (role,experience,topicsToFocus,numberOfQuestions) => (
   ` You are an AI trained to generate technical iterview questions and answer.
   
   Task:
   - Role : ${role}
   - Candidate Experience : ${experience}
   - Focus Topics : ${topicsToFocus}
   - Write ${numberOfQuestions} interview questions
   - For each question generate a detailed but beginner-friendly answer
   - If answer needs a code example , generate a samll code inside
   - Keep formatting very clean
   - Return a pure JSON array like:
   [
    {
        "question":"Question here",
        "answer":"Answer here"
    },
    ....
   ]
    Important: Do not return any extra text.Only return valid JSON
   ` )

   const conceptExplainPrompt = (question) => (`
    You are an AI trained to generate technical iterview questions

    Task:
    - Explain the following question and its concept in depth as if you are teaching a beginner developer
    - Question : "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for an article or the page header
    - Keep the formatting very clean and clear
    - return the result as a valid JSON object in the following format:

   {
        "title":"Short title here",
        "explanation":"explanation here" 
   }
         Important: Do not return any extra text.Only return valid JSON
    `)

    module.exports = {questionAnswerPrompt,conceptExplainPrompt}
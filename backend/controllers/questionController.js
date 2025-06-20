const Question = require("../models/Question")
const Session = require("../models/Session")

//@desc Add additional question to existing session
//@route POST api/questions/add
//@access PRIVATE
exports.addQuestionsToSession = async (req,res) => {
    try{
        const {sessionId,questions} = req.body

        if(!sessionId || !questions || !Array.isArray(questions)){
            return res.status(400).json({msg:"Invalid input data"})
        }

        const session = await Session.findById(sessionId)

        if(!session){
            return res.status(404).json({msg:"Session not found"})
        }

        //Create new questions
        const createdQuestions = await Question.insertMany(
            questions.map((q) => ({
                session:sessionId,
                question:q.question,
                answer:q.answer
            }))
        )

        //Update session to include to include new session question IDs
        session.questions.push(...createdQuestions.map((q) => q._id))
        await session.save();

        res.status(201).json(createdQuestions)

    }catch(error){
        return res.status(500).json({msg:"Server error"})
    }
}

//@desc pin or unpin a question
//@route POST api/questions/:id/pin
//@access PRIVATE
exports.togglePinQuestion = async (req,res) => {
     try{
        const question = await Question.findById(req.params.id);

        if(!question){
        return res.status(401).json({msg:"Question not found"})
        }

        question.isPinned = !question.isPinned;
        await question.save();

        res.status(200).json({success:true,question})

    }catch(error){
        return res.status(500).json({msg:"Server error"})
    }
}

//@desc Update a note for a question
//@route POST api/questions/:id/note
//@access PRIVATE
exports.updateQuestionNote = async (req,res) => {
    try{
        const { note } = req.body
        const question = await Question.findById(req.params.id);

        if(!question){
            return res.status(404).json({success:false,msg:"Question not found"})
        }

        question.note = note || ""
        await question.save();

        res.status(200).json({success:true,question})

    }catch(error){
        return res.status(500).json({msg:"Server error"})
    }
}
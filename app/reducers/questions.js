import { getRandomIndex } from 'util.js';
import { 
    REDUCE_TRIES, 
    NEXT_QUESTION, 
    RESET, 
    MARK_AS_ANSWERED,
    SEED_QUESTIONS
} from 'actions/actions';


/**
 * 
 * @param {type} questions
 * @returns {randomQuestion.questionsAnonym$3}
 */
function randomQuestion(questions,answered) {
    let
        unanswered = questions.filter( question => {
           return (answered.indexOf(question.id) < 0 ); 
        }),
        currentIndex = getRandomIndex(unanswered),
        current = unanswered[currentIndex];
        
    current.triesLeft = triesAllowed(current);
    current.animate = true;
    current.answered = false;
    current.attempts = [];

    return current;
}

/**
 * 
 * @param {Object} question
 * @returns {Number}
 */
function triesAllowed(question) {
    return (question.options.length - 1)
}

/**
 * 
 * @param {type} questionSet
 * @param {type} answeredQuestions
 * @returns {setQuestion.state}
 */
function setQuestion(questionSet, answeredQuestions) {

    let current  = randomQuestion(questionSet,answeredQuestions),
        questions = questionSet,
        answered = answeredQuestions,
        remaining = questions.length - ( answeredQuestions.length + 1),
        state = { current, questions, answered, remaining };
   
    return state;
}

/**
 * 
 * @type setQuestion.state
 */
//let initialState = setQuestion(questionSet,[]);

let initialState = null;

export default (state = initialState, action) => {
    switch (action.type) {
        case MARK_AS_ANSWERED:
            return Object.assign(
                {} ,
                state , 
                { 
                    current : Object.assign(
                        {} ,
                        state.current ,
                        { answered:true, animate:false } 
                    ) 
                }
            );
        case NEXT_QUESTION:
            let newState = setQuestion(
                state.questions, 
                [...state.answered, state.current.id]
            );
            return newState;
        case REDUCE_TRIES:
            var newCurrentQuestionState = {
                triesLeft : state.current.triesLeft - 1,
                attempts : [...state.current.attempts,action.payload.attempt],
                animate:false
            };
            return Object.assign(
                {} ,
                state, 
                { 
                    current : Object.assign(
                        state.current,
                        newCurrentQuestionState
                    ) 
                }
            );
        case RESET:
            return setQuestion(state.questions,[])
        case SEED_QUESTIONS:
            return setQuestion(action.payload.questions,[])
        default:
            return state;
    }
}
import { Stux } from 'stux';
import { QuestionsResult, QnABaseItem, Question } from '../contracts';
import { FetchState } from '../Stores/QnAStore';
 
export var Actions = {
  fetchQnA: Stux.createAction<QuestionsResult>(),
  setFetchState: Stux.createAction<FetchState>(),
  askAQuestion: Stux.createAction<QnABaseItem>(),
  editQuestion: Stux.createAction<QnABaseItem>(),
  editAnswer: Stux.createAction<{
    response: QnABaseItem,
    question: Question
  }>(),
  replyThread: Stux.createAction<{
    response: QnABaseItem,
    question: Question
  }>()
};
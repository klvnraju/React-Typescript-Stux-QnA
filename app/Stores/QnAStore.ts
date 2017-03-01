import { Stux } from 'stux';
import { QuestionsResult, QnABaseItem, Question } from '../contracts';
import { Actions } from '../Actions/QnAActions';

export enum FetchState {
  Initial,
  Loaded,
  Loading,
  Error
}

export interface QnAStoreState {
  questionsResult: QuestionsResult;
  fetchState: FetchState;
}

class QnAStoreDefinition extends Stux.Store<QnAStoreState> {
  private qnaStoreState: QnAStoreState;
  constructor() {
    super();
    this.qnaStoreState = {fetchState: FetchState.Initial} as QnAStoreState;
    this.listenTo(Actions.fetchQnA, this.onFetchQnA);
    this.listenTo(Actions.setFetchState, this.onSetFetchState);
    this.listenTo(Actions.askAQuestion, this.onAskAQuestion);
    this.listenTo(Actions.editQuestion, this.onEditQuestion);
    this.listenTo(Actions.editAnswer, this.onEditAnswer);
    this.listenTo(Actions.replyThread, this.onReplyThread);
  }

  data() {
    return this.qnaStoreState;
  }

  onFetchQnA(questionsResult: QuestionsResult) {
    this.qnaStoreState.questionsResult = questionsResult;
    this.qnaStoreState.fetchState = FetchState.Loaded;
    this.trigger(this.qnaStoreState);
  }

  onSetFetchState(state: FetchState) {
    this.qnaStoreState.fetchState = state;
    this.trigger(this.qnaStoreState);
  }

  onAskAQuestion(qnaItem: QnABaseItem) {
    var question: Question = {
      ...qnaItem,
      responses: []
    }
    this.qnaStoreState.questionsResult.questions.push(question);
    this.trigger(this.qnaStoreState);
  }

  onEditQuestion(question: QnABaseItem) {
    this.qnaStoreState.questionsResult.questions.forEach(eachQuestion => {
      if (eachQuestion.id == question.id) {
        eachQuestion.text = question.text;
        eachQuestion.updatedDate = question.updatedDate;
      }
    });
    this.trigger(this.qnaStoreState);
  }

  onEditAnswer(props: { response: QnABaseItem, question: Question }) {
    this.qnaStoreState.questionsResult.questions.forEach(eachQuestion => {
      if (eachQuestion.id == props.question.id) {
        eachQuestion.responses.forEach(eachResponse => {
          if(eachResponse.id == props.response.id) {
            eachResponse.text = props.response.text;
            eachResponse.updatedDate = props.response.updatedDate;
          }
        });
      }
    });
    this.trigger(this.qnaStoreState);
  }

  onReplyThread(props: { response: QnABaseItem, question: Question }) {
    this.qnaStoreState.questionsResult.questions.forEach(eachQuestion => {
      if (eachQuestion.id == props.question.id) {
        eachQuestion.responses.push(props.response);
      }
    });
    this.trigger(this.qnaStoreState);
  }
}

export var QnAStore = new QnAStoreDefinition();
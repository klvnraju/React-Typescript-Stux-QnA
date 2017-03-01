import { Actions } from './QnAActions';
import { QnASource } from '../Sources/QnASource';
import { FetchState } from '../Stores/QnAStore';
import { QnABaseItem, Question } from '../contracts';
import * as Q from 'q';

export class QnAActionCreator {    
    constructor(private _qnaSource?: QnASource) {
    }

    public fetchQnAData(): Q.Promise<any> {
      var defer = Q.defer<any>();

      Actions.setFetchState(FetchState.Loading);
      this.qnaSource.fetchQnA().then((value) => {
        Actions.fetchQnA(value);
        defer.resolve(null);
      }, (error: any) => {
        Actions.setFetchState(FetchState.Error);
        defer.reject(error);
      });

      return defer.promise;
    }

    public askAQuestion(questionText: string): Q.Promise<any> {
      var defer = Q.defer<any>();

      this.qnaSource.askAQuestion(questionText).then((value: QnABaseItem) => {
        Actions.askAQuestion(value);
        defer.resolve(null);
      }, (error: any) => {
        defer.reject(error);
      });

      return defer.promise;
    }

    public editQuestion(question: Question, modifiedText: string): Q.Promise<any> {
      var defer = Q.defer<any>();

      this.qnaSource.editQuestion(question, modifiedText).then((value: QnABaseItem) => {
        Actions.editQuestion(value);
        defer.resolve(null);
      }, (error: any) => {
        defer.reject(error);
      });

      return defer.promise;
    }

    public editAnswer(question: Question, answer: QnABaseItem, modifiedText: string): Q.Promise<any> {
      var defer = Q.defer<any>();

      this.qnaSource.editAnswer(question, answer, modifiedText).then((value: QnABaseItem) => {
        Actions.editAnswer({question: question, response: value});
        defer.resolve(null);
      }, (error: any) => {
        defer.reject(error);
      });

      return defer.promise;
    }

    public replyThread(question: Question, replyText: string): Q.Promise<any> {
      var defer = Q.defer<any>();

      this.qnaSource.replyThread(question, replyText).then((value: QnABaseItem) => {
        Actions.replyThread({question: question, response: value});
        defer.resolve(null);
      }, (error: any) => {
        defer.reject(error);
      });

      return defer.promise;
    }
    
    private get qnaSource(): QnASource {
      if (!this._qnaSource) {
        this._qnaSource = new QnASource();
      }

      return this._qnaSource;
    }
 }
import { QuestionsResult, QnABaseItem, Question } from '../contracts';
import * as Q from 'q';

var id = 100;

export class QnASource {
    public fetchQnA(): Q.Promise<QuestionsResult> {
        var defer = Q.defer<QuestionsResult>();

        setTimeout(() => {
          //defer.reject("dummy reason");SampleQnAData;
          defer.resolve(SampleQnAData);
        }, 1000);

        return defer.promise;
    }

    public askAQuestion(questionText: string): Q.Promise<QnABaseItem> {
        var defer = Q.defer<QnABaseItem>();
        var d = new Date();
        var qnaItem: QnABaseItem = {
          createdDate: d,
          id: id++,
          status: 2,
          text: questionText, 
          updatedDate: d,
          user: {
            displayName: 'Nagaraju Kotcharlakota',
            id: "c9424ced-7a35-47b6-b915-0702d0d8acb3"
          }
        }

        setTimeout(() => {
          //defer.reject("dummy reason to ask");qnaItem;
          defer.resolve(qnaItem);
        }, 1000);

        return defer.promise;
    }

    public editQuestion(question: QnABaseItem, modifiedText: string): Q.Promise<QnABaseItem> {
        var defer = Q.defer<QnABaseItem>();
        var d = new Date();
        var qnaItem: QnABaseItem = {
          createdDate: question.createdDate,
          id: question.id,
          status: question.status,
          text: modifiedText, 
          updatedDate: d,
          user: {
            displayName: question.user.displayName,
            id: question.user.id
          }
        }

        setTimeout(() => {
          //defer.reject("dummy reason to edit");qnaItem;
          defer.resolve(qnaItem);
        }, 1000);

        return defer.promise;
    }

    public editAnswer(question: Question, answer: QnABaseItem, modifiedText: string): Q.Promise<QnABaseItem> {
        var defer = Q.defer<QnABaseItem>();
        var d = new Date();
        question.id;
        var qnaItem: QnABaseItem = {
          createdDate: answer.createdDate,
          id: answer.id,
          status: answer.status,
          text: modifiedText, 
          updatedDate: d,
          user: {
            displayName: answer.user.displayName,
            id: answer.user.id
          }
        }

        setTimeout(() => {
          //defer.reject("dummy reason to edit");qnaItem;
          defer.resolve(qnaItem);
        }, 1000);

        return defer.promise;
    }

    public replyThread(question: Question, replyText: string): Q.Promise<QnABaseItem> {
        var defer = Q.defer<QnABaseItem>();
        var d = new Date();
        question.id;
        var qnaItem: QnABaseItem = {
          createdDate: d,
          id: id++,
          status: 2,
          text: replyText,
          updatedDate: d,
          user: {
            displayName: 'Nagaraju Kotcharlakota',
            id: "c9424ced-7a35-47b6-b915-0702d0d8acb3"
          }
        }

        setTimeout(() => {
          //defer.reject("dummy reason to edit");qnaItem;
          defer.resolve(qnaItem);
        }, 1000);

        return defer.promise;
    }
}

var SampleQnAData: QuestionsResult = {
    	"questions": [{
		"responses": [{
			"id": 34,
			"text": "My first Answer to the third question",
				"user": {
					"id": "",
					"displayName": ""
				},
			"createdDate": new Date("2017-02-28T14:58:12.31Z"),
			"updatedDate": new Date("2017-02-28T14:58:12.31Z"),
			"status": 4

			}, {
				"id": 35,
				"text": "My UPDATED second answer to the third question",
				"user": {
					"id": "a4b38d07-7593-43b6-884e-1a085af3bbeb",
					"displayName": "Nagaraju Kotcharlakota"
				},
				"createdDate": new Date("2017-02-28T15:00:24.483Z"),
				"updatedDate": new Date("2017-02-28T15:00:58.137Z"),
				"status": 2
			}
		],
		"id": 33,
		"text": "My UPDATED third question",
		"user": {
			"id": "a4b38d07-7593-43b6-884e-1a085af3bbeb",
			"displayName": "Nagaraju Kotcharlakota"
		},
		"createdDate": new Date("2017-02-28T14:58:00.09Z"),
		"updatedDate": new Date("2017-02-28T14:59:22.067Z"),
		"status": 2
		}, {
			"responses": [],
			"id": 32,
			"text": "My Second Question",
			"user": {
				"id": "0fac4c25-72a6-4c32-87ee-9e1391b2c855",
				"displayName": "Ken Cenerelli"
			},
			"createdDate": new Date("2017-02-28T14:57:54.43Z"),
			"updatedDate": new Date("2017-02-28T14:57:54.43Z"),
			"status": 0
		}
	],
	"hasMoreQuestions": true
};
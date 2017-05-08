import * as React from 'react';
import { Button } from 'office-ui-fabric-react/lib/Button';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { QnAItemRow } from '../Components/QnAItemRow';
import { AskQuestionDialog, Props as AskQuestionDialogProps } from '../Components/AskQuestionDialog';
import { Stux } from 'stux';
import { QnAStore, QnAStoreState, FetchState } from '../Stores/QnAStore';
import { QnAActionCreator } from '../Actions/QnAActionCreator';
import { Question, QnABaseItem } from '../contracts';
import { CommonStyles } from '../CommonStyles';
import * as Q from 'q';

import "./QnAContainer.scss";

export interface IPublisherDetails {
    currentUserPublisher: boolean;
    publisherDisplayName: string;
    publisherImageLink: string;
}

export interface IUserDetails {
    displayName: string;
    id: string;
    getImageUrlForAUser: (id: string) => string;
}

interface Props {
    name: string;
    qnaActionCreator: QnAActionCreator;
    publisherDetails: IPublisherDetails;
    userDetails: IUserDetails;
}

interface State {
  loaded: boolean;
  showDialog: boolean;
  value: string;
  placeholderText: string;
  subText: string;
  textAreaLabel: string;
  title: string;
  initialValue: string;
  successCallback: (text: string) => Q.Promise<any>;
  qnaStoreState?: QnAStoreState;
}

@Stux.Component
export default class QnAContainerComponent extends React.Component<Props, State> {
    // Stux.Component declarations
    linkState: <P>(store: Stux.Store<P>, state: string) => void;
    listenTo: <P>(action: Stux.Action<P>, callback: Stux.Listener<P>) => void;
    
    constructor(props: Props) {
        super(props);
        this.state = { loaded: false, showDialog: false } as State;
        this.linkState(QnAStore, "qnaStoreState");
        this.props.qnaActionCreator.fetchQnAData();
    }

    componentDidMount() {
      this.setState({loaded: true} as State);
    }

    render() {
        var qnaObjects = [];
        var askAQuestionDisabled: boolean = true;
        //Shallow copy of an object so that when copy changes the original is intact.
        var askAQuestionStyle = {...styles.askQuestionButtonContainerStyle};
        if(!this.state.qnaStoreState || this.state.qnaStoreState.fetchState == FetchState.Initial || this.state.qnaStoreState.fetchState == FetchState.Loading) {
            qnaObjects.push(
                <div key="loading" style={{marginTop: "20px"}}>
                    <Spinner size={SpinnerSize.large}>Loading...</Spinner>
                </div>);
        } else if(this.state.qnaStoreState.fetchState == FetchState.Error) {
            qnaObjects.push(<div style={{marginTop: "10px"}} key="errormessage">
                    <MessageBar>Error loading the data. Please refresh the page after some time.</MessageBar>
                </div>);
        } else {
            for(var i=0; i < this.state.qnaStoreState.questionsResult.questions.length; i++) {
                qnaObjects.push(<QnAItemRow question={this.state.qnaStoreState.questionsResult.questions[i]} onAnswerClick={this.OnAnswerClick} 
                    onEditAnswerClick={this.OnEditAnswerClick} onEditQuestionClick={this.OnEditQuestionClick} publisherDetails={this.props.publisherDetails}
                    userDetails={this.props.userDetails} key={this.state.qnaStoreState.questionsResult.questions[i].id}></QnAItemRow>);
            }
            askAQuestionDisabled = false;
        }

        if(askAQuestionDisabled) {
            askAQuestionStyle.backgroundColor = CommonStyles.disabledButtonColor;
        }

        var askQuestionDialogProps: AskQuestionDialogProps = {
            closeDialog: this._closeDialog.bind(this),
            initialValue: this.state.initialValue,
            placeholderText: this.state.placeholderText,
            showDialog: this.state.showDialog,
            subText: this.state.subText,
            textAriaLabel: this.state.textAreaLabel,
            title: this.state.title,
            successCallback: this.state.successCallback
        }

        return <div>
            <div style={styles.qnaControlContainer}>
                <div className="ms-Grid" style={styles.tableStyle}>
                  <div className="ms-Grid-row" style={styles.trStyle}>
                      <AskQuestionDialog {...askQuestionDialogProps} />
                      <Button className="ask-question-button" style={askAQuestionStyle} onClick={this.OnAskAQuestionClick} 
                        ariaDescription='Ask a question' disabled={askAQuestionDisabled}>Ask a question</Button>
                      <h2 style={styles.qnaSectionHeader}>Customer Questions & Answers</h2>
                  </div>
                  {qnaObjects}
                </div>
            </div>
        </div>;
    }

    OnAnswerClick = (question: Question) => {
      var successCallback = (text: string) => {
        return this.props.qnaActionCreator.replyThread(question, text);
      };
      this._showDialog('', 'Your comment goes here (up to 2000 characters)',
                  'Your comment will be posted publically as ' + this.displayNameForAnswer, 'Please enter your comment here', 'Add a comment', successCallback);
    }

    OnEditQuestionClick = (question: Question) => {
      var successCallback = (text: string) => {
        return this.props.qnaActionCreator.editQuestion(question, text);
      };
      this._showDialog(question.text, 'Your question goes here (up to 2000 characters)',
                  'Your question will be posted as ' + this.props.userDetails.displayName, 'Please enter your question here', 'Ask a question', successCallback);
    }

    OnEditAnswerClick = (question: Question, answer: QnABaseItem) => {
      var successCallback = (text: string) => {
        return this.props.qnaActionCreator.editAnswer(question, answer, text);
      };
      this._showDialog(answer.text, 'Your comment goes here (up to 2000 characters)',
                  'Your comment will be posted as ' + this.displayNameForAnswer, 'Please enter your comment here', 'Add a comment', successCallback);
    }

    OnAskAQuestionClick = (event: React.MouseEvent<any>) => {
      var successCallback = (text: string) => {
        return this.props.qnaActionCreator.askAQuestion(text);
      };
      this._showDialog('', 'Your question goes here (up to 2000 characters)',
          'Your question will be posted publically as ' + this.props.userDetails.displayName, 'Please enter your Question here', 'Ask a question', successCallback);
      event.preventDefault();
    }

    private _showDialog(value: string, placeholderText: string, subText: string, textAreaLabel: string, title: string, successCallback: (text: string) => Q.Promise<any>) {
        this.setState({
            showDialog: true,
            initialValue: value,
            placeholderText: placeholderText,
            subText: subText,
            textAreaLabel: textAreaLabel,
            title: title,
            successCallback: successCallback
        } as State);
    }

    private _closeDialog() {
        this.setState({ showDialog: false } as State);
    }

    private get displayNameForAnswer(): string {
        if(this.props.publisherDetails.currentUserPublisher) {
            return this.props.publisherDetails.publisherDisplayName;
        }
        return this.props.userDetails.displayName;
    }
}

var styles = {
    galleryCenteredContent: {
            width: '1160px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '10px',
            paddingRight: '10px'
        },
    tableStyle: {
            borderCollapse: 'collapse',
            marginTop: '-8px',
            width: 'inherit'
        },
    trStyle: {
          borderCollapse: 'collapse',
          borderBottom: '1px solid #a9a9a9',
          borderWidth: '1px 0'
      },
    qnaControlContainer: {
            width: "700px",
            display: "inline-block",
            //marginTop: "-40px",
            marginBottom: "34px"
        },
    qnaSectionHeader: {
            display: "block",
            fontSize: "20px",
            marginTop: ".83em",
            marginBottom: "30px"
        },
    askQuestionButtonContainerStyle: {
            float: 'right',
            fontSize: '14px',
            right: '5px',
            top: '0px',
            backgroundColor: '#E2165E',
            color: '#FFFFFF'
        }
}
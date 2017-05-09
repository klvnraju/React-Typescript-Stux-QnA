import * as React from 'react';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Question, QnABaseItem, QnAItemStatus } from '../contracts';
import { IPublisherDetails, IUserDetails } from './QnAContainer';
import { StringUtils } from '../Utils/string';
import * as moment from 'moment';
import 'moment-shortformat';

import './QnAItemRow.scss';

export interface Props {
    question: Question;
    publisherDetails: IPublisherDetails;
    userDetails: IUserDetails;
    onAnswerClick: (question: Question) => void;
    onEditQuestionClick: (question: Question) => void;
    onEditAnswerClick: (question: Question, answer: QnABaseItem) => void;
}

export interface State {
    responsesExpanded: boolean;
}

export class QnAItemRow extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = { responsesExpanded: false };
    }
    
    public render() {
        var question: Question = this.props.question;
        var image = this.props.userDetails.getImageUrlForAUser(question.user.id);
        
        var responsesSection: JSX.Element = <div/>;
        if(question.responses && question.responses.length > 0) {
            var answers: JSX.Element[] = [];
            if(this.state.responsesExpanded) {
                for(var i:number = 0; i < question.responses.length; i++) {
                    var answer=question.responses[i];
                    var isQuestionEditable: boolean = (question.status & QnAItemStatus.UserEditable) === QnAItemStatus.UserEditable;
                    answers.push(<AnswerContent qnaItem={answer} questionUser={question.user.id} key={answer.id} editAnswerClickEvent={
                        (event: React.MouseEvent<any>) => { return this.EditAnswerClick(event, answer); }
                    } lastAnswerShowReply={isQuestionEditable && i === (question.responses.length - 1)} answerClickEvent={this.AnswerClick} 
                    parentProps={this.props} />);
                }
                answers.push(<Link key="seelessanswerslink" href="#" onClick={this.SeeLessAnswersClicked}>See less answers</Link>);
            }
            else {
                var answer=question.responses[0];
                var isQuestionEditable: boolean = (question.status & QnAItemStatus.UserEditable) === QnAItemStatus.UserEditable;
                answers.push(<AnswerContent key={answer.id} qnaItem={answer} questionUser={question.user.id} editAnswerClickEvent={
                        (event: React.MouseEvent<any>) => { return this.EditAnswerClick(event, answer); }
                    } lastAnswerShowReply={isQuestionEditable && 1 === question.responses.length} answerClickEvent={this.AnswerClick}
                    parentProps={this.props} />);
                if(question.responses.length > 1) {
                    var linkText: string = "See more answers (" + (question.responses.length - 1) + ")";
                    answers.push(<Link key="seemoreanswerslink" href="#" onClick={this.SeeMoreAnswersClicked}>{linkText}</Link>);
                }
            }
            responsesSection = <div className="ms-Grid">
                {answers}
            </div>;
        }

        var actionLinks = [];
        if((question.status & QnAItemStatus.UserEditable) === QnAItemStatus.UserEditable) {
            actionLinks.push(<Link href="#" key="answerButton" onClick={this.AnswerClick} style={styles.actionLinksStyle}>Reply</Link>);
            actionLinks.push(<Link href="#" key="editQuestionButton" onClick={this.EditQuestionClick} style={styles.actionLinksStyle}>Edit</Link>);
        } else if(this.props.publisherDetails.currentUserPublisher) {
            actionLinks.push(<Link href="#" key="answerButton" onClick={this.AnswerClick} style={styles.actionLinksStyle}>Reply</Link>);
        }

        return <div className="ms-Grid-row trStyle">
            <div className="ms-Grid-col ms-u-sm1" style={styles.userImageTdStyle}>
                <img style={styles.userImageStyle} src={image}></img>
            </div>
            <div className="ms-Grid-col ms-u-sm11" style={styles.userReviewsTdStyle}>
                <ReadMoreContent qnaItem={question} parentProps={this.props} />
                <div style={styles.userReviewsContent}>
                    <div>
                        {actionLinks}
                    </div>
                </div>
                {responsesSection}
            </div>
        </div>;
    }

    SeeMoreAnswersClicked = (event: React.MouseEvent<any>) => {
        this.setState({responsesExpanded: true});
        event.preventDefault();
    }

    SeeLessAnswersClicked = (event: React.MouseEvent<any>) => {
        this.setState({responsesExpanded: false});
        event.preventDefault();
    }

    EditQuestionClick = (event: React.MouseEvent<any>) => {
        this.props.onEditQuestionClick(this.props.question);
        event.preventDefault();
    }

    EditAnswerClick = (event: React.MouseEvent<any>, answer: QnABaseItem) => {
        this.props.onEditAnswerClick(this.props.question, answer);
        event.preventDefault();
    }

    AnswerClick = (event: React.MouseEvent<any>) => {
        this.props.onAnswerClick(this.props.question);
        event.preventDefault();
    }
}

var AnswerContent = (props: {qnaItem: QnABaseItem, questionUser: string, lastAnswerShowReply: boolean, editAnswerClickEvent: (event: React.MouseEvent<any>) => void, answerClickEvent: (event: React.MouseEvent<any>) => void, parentProps: Props}): JSX.Element => {
    var image: string;
    if((props.qnaItem.status & QnAItemStatus.PublisherCreated) == QnAItemStatus.PublisherCreated) {
        image = props.parentProps.publisherDetails.publisherImageLink;
    } else {
        image = props.parentProps.userDetails.getImageUrlForAUser(props.qnaItem.user.id);
    }

    var actionLinks = [];
    if(props.lastAnswerShowReply) {
        actionLinks.push(<Link href="#" key="answerButton" onClick={props.answerClickEvent} style={styles.actionLinksStyle}>Reply</Link>);
    }
    if((props.qnaItem.status & QnAItemStatus.UserEditable) === QnAItemStatus.UserEditable) {
        actionLinks.push(<Link href="#" key="editAnswerButton" onClick={props.editAnswerClickEvent} style={styles.actionLinksStyle}>Edit</Link>);
    }

    return <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-u-sm1">
            <div style={styles.userSecondaryImageTdStyle}>
                <img style={styles.userImageStyle} src={image}></img>
            </div>
        </div>
        <div className="ms-Grid-col ms-u-sm11" style={styles.userReviewsTdStyle}>
            <ReadMoreContent qnaItem={props.qnaItem} parentProps={props.parentProps} />
            <div style={styles.userReviewsContent}>
                <div>
                    {actionLinks}
                </div>
            </div>
        </div>
    </div>;
}

var ReadMoreContent = (props: {qnaItem: QnABaseItem, parentProps: Props}): JSX.Element => {
    var displayName: string;
    if((props.qnaItem.status & QnAItemStatus.PublisherCreated) == QnAItemStatus.PublisherCreated) {
        displayName = props.parentProps.publisherDetails.publisherDisplayName;
    } else {
        displayName = props.qnaItem.user ? props.qnaItem.user.displayName : '';
    }
    var mom = moment(props.qnaItem.createdDate);
    var userNameAndCreationDate = StringUtils.format("By {0} on {1}", displayName, (mom as any).short());
    return <div>
        <div>
            <div style={styles.readMoreContainerStyle}>
                <span style={styles.reviewTextStyle}>{props.qnaItem.text}</span>
            </div>
            <span className='bowtie-icon bowtie-alert report-review-style' title='Report Review'>
            </span>
        </div>
        <div style={styles.readMoreControlStyle}>
            <div style={styles.userNameDivStyle}>
                {userNameAndCreationDate}
            </div>
        </div>
    </div>;
}


var styles = {
    trStyle: {
        borderCollapse: 'collapse',
        borderBottom: '1px solid #a9a9a9',
        borderWidth: '1px 0'
    },
    userSecondaryImageTdStyle: {
        borderCollapse: 'collapse',
        padding: '14px 0px 14px 0px',
        verticalAlign: 'top'
    },
    userImageTdStyle: {
        borderCollapse: 'collapse',
        padding: '14px 5px 14px 10px',
        textAlign: 'center',
        verticalAlign: 'top'
    },
    userReviewsTdStyle: {
        borderCollapse: 'collapse',
        padding: '14px 5px 14px 10px'
    },
    userImageStyle: {
        width: '44px',
        height: '44px'
    },
    userReviewsContent: {
        marginTop: '-4.5px'
    },
    userNameDivStyle: {
        display: 'inline-block',
        fontSize: '14px',
        color: 'gray'
    },
    readMoreControlStyle: {
        marginTop: '12px',
        marginBottom: '10px',
        width: '626px'
    },
    readMoreContainerStyle: {
        wordWrap: 'break-word'
    },
    reviewTextStyle: {
        whiteSpace: 'pre-line'
    },
    actionLinksStyle: {
        marginRight: '10px'
    }
};
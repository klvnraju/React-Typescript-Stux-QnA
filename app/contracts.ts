/**
 * The core structure of a QnA item
 */
export interface QnABaseItem {
    /**
     * Time when the review was first created
     */
    createdDate: Date;
    /**
     * Unique identifier of a QnA item
     */
    id: number;
    /**
     * Get status of item
     */
    status: QnAItemStatus;
    /**
     * Text description of the QnA item
     */
    text: string;
    /**
     * Time when the review was edited/updated
     */
    updatedDate: Date;
    /**
     * User details for the item.
     */
    user: UserIdentityRef;
}

/**
 * Identity reference with name and guid
 */
export interface UserIdentityRef {
    /**
     * User display name
     */
    displayName: string;
    /**
     * User VSID
     */
    id: string;
}

export enum QnAItemStatus {
    None = 0,
    /**
     * The Deleted flag is for soft deleting an item
     */
    Deleted = 1,
    /**
     * The UserEditable flag indicates whether the item is editable by the logged in user.
     */
    UserEditable = 2,
    /**
     * The PublisherCreated flag indicates whether the item has been created by extension publisher.
     */
    PublisherCreated = 4
}

export interface Response extends QnABaseItem {

}

/**
 * The structure of the question / thread
 */
export interface Question extends QnABaseItem {
    /**
     * List of answers in for the question / thread
     */
    responses: Response[];
}

export interface QuestionsResult {
    /**
     * Flag indicating if there are more QnA threads to be shown (for paging)
     */
    hasMoreQuestions: boolean;
    /**
     * List of the QnA threads
     */
    questions: Question[];
}

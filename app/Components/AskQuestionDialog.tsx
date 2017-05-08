import * as React from 'react';
import { Button, ButtonType } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import * as Q from 'q';

import './AskQuestionDialog.scss';

export interface Props {
    initialValue: string,
    placeholderText: string,
    textAriaLabel: string,
    title: string,
    subText: string,
    showDialog: boolean,
    closeDialog: () => void;
    successCallback?: (text: string) => Q.Promise<any>;
}

export interface State {
    textValue: string,
    errorMessage: string
}

export class AskQuestionDialog extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {textValue: props.initialValue} as State;
    }
    
    public render() {
        var errorMessage: JSX.Element = <div />;
        var saveDisabled: boolean = false;
        if(this.state.errorMessage) {
            errorMessage = <MessageBar key="errorfetching">Error loading the data. Please refresh the page after some time.</MessageBar>
        }
        if(this.state.textValue == '' || this.state.textValue == this.props.initialValue) {
            saveDisabled = true;
        }

        return <Dialog isOpen={this.props.showDialog} type={DialogType.normal} onDismiss={this.closeDialog}
                    title={this.props.title} subText={this.props.subText}
                    isBlocking={false} containerClassName='QnAAskQuestionDialog' onLayerMounted={this.onLayerMounted}>
                    <TextField multiline resizable={false} rows={4} value={this.state.textValue}
                        placeholder={this.props.placeholderText} ariaLabel={this.props.textAriaLabel} onChanged={this.onTextChange} />
                    {errorMessage}
                    <DialogFooter>
                        <Button onClick={this.closeDialog}>Cancel</Button>
                        <Button buttonType={ButtonType.primary} disabled={saveDisabled} onClick={() => {
                                if(this.state.textValue == '' || this.state.textValue == this.props.initialValue) {
                                    return;
                                }
                                if(this.props.successCallback) {
                                    this.props.successCallback(this.state.textValue).then(() => {
                                        this.closeDialog();
                                    }, (error: any) => {
                                        this.setState({errorMessage: error} as State);
                                    });
                                }
                            }}>Save</Button>
                    </DialogFooter>
                </Dialog>;
    }

    onLayerMounted = () => {
        this.setState({textValue: this.props.initialValue} as State);
    }

    closeDialog = () => {
        this.props.closeDialog();
    }

    onTextChange = (newValue: any) => {
        this.setState({textValue: newValue} as State);
    }
}
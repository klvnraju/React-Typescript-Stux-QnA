import * as React from "react";
import * as ReactDOM from "react-dom";
import QnAContainerComponent from "./Components/QnAContainer";
import { QnAActionCreator } from './Actions/QnAActionCreator';

ReactDOM.render(
  <div>
    <QnAContainerComponent name="someName" qnaActionCreator={new QnAActionCreator()} 
      publisherDetails={{
        currentUserPublisher: false, 
        publisherDisplayName: 'Microsoft',
        publisherImageLink:'https://visualstudioonlineapplicationinsights.gallerycdn.vsassets.io/extensions/visualstudioonlineapplicationinsights/developeranalyticstools/7.18.214.2/1488284147384/Microsoft.VisualStudio.Services.Icons.Default'
      }}
      userDetails={{
        displayName: 'Nagaraju Kotcharlakota',
        getImageUrlForAUser: (id: string) => {
          return 'https://marketplace.visualstudio.com/avatar?userid=' + id;
        },
        id: 'a4b38d07-7593-43b6-884e-1a085af3bbeb'
      }}/>
  </div>,
  document.getElementById("app")
);

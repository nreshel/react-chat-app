import React from 'react';
import ReactEmoji from 'react-emoji';
import '../styles/Message.css';


const Message = ({ message: { user, text }, name }) => {
  let isSentByUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByUser = true;
  }
  if(isSentByUser) {
    return (
      <div className="messageContainer justifyEnd">
        <p className="sentText pr-10">{trimmedName}</p>
        <div className="messageBox backgroundBlue ">
          <p className="messageText colorWhite">
            {ReactEmoji.Emojify(text) }
          </p>
        </div>
      </div>
    ) 
  } else {
    return (
      <div>
        <div className="messageContainer justifyStart">
        <div className="messageBox backgroundLight">
          <p className="messageText colorDark">
            {ReactEmoji.emojify(text) }
          </p>
        </div>
        <p classN ame="sentText pl-10">{user}</p>
      </div>
      </div>
    )
  }
}

export default Message

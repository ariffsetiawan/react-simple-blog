import React from 'react';
import moment from 'moment';
import Dexie from 'dexie'
import CommentBox from './CommentBox';
import { connect } from 'react-redux';

const db = new Dexie('SimpleBlog');
db.version(1).stores(
  { posts: "++id,title,content,date", comments: "++id,post_id,parent_id,content,author,avatar,date" }
)

class Comment extends React.Component {

  state = { 
    authorName: '',
    authorNameIsSet: false 
  };

  onChangeAuthorName = (e) => this.setState({ authorName: e.currentTarget.value, avatar: "https://ui-avatars.com/api/name="+e.currentTarget.value.replace(/\s+$/, '')+"&background=random"});
  onChangeComment = (e) => this.setState({ comment: e.currentTarget.value });

  onSubmitAuthorName = (e) => {

      e.preventDefault();
      this.setState({ authorNameIsSet: true });
  };

  // fetch comments
  getComments = () => {
      return new Promise(function(resolve, reject) {
        resolve('start of new Promise');
      }).then( value => {
        return db.comments.where('post_id').equals(this.props.postId).toArray();
      }).catch(console.error);
  };

  normalizeComment = (comment) => {
    const id = comment.id.toString();
    const timestamp = moment(comment.date).format("MMMM D, YYYY")+" AT "+moment(comment.date).format("LT");

    return {
      id,
      bodyDisplay: comment.content,
      userNameDisplay: comment.author,
      userAvatarUrl: comment.avatar,
      timestampDisplay: timestamp,
      belongsToAuthor: false,
      parentCommentId: parseInt(comment.parent_id)
    };
  };

  // submit comment
  comment = (body, parentCommentId = null, authorName = this.state.authorName.replace(/\s+$/, '')) => {
    return new Promise(function(resolve, reject) {
      resolve('start of new Promise');
    }).then( value => {
      const post_id = this.props.postId
      const author = authorName
      const content = body
      const date = moment().format("YYYY-MM-DD HH:mm:ss")
      const parent_id = parentCommentId
      const avatar = "https://ui-avatars.com/api/name="+author+"&background=random"
      db.comments.add({
        post_id,
        parent_id,
        content,
        author,
        avatar,
        date
      })

    }).catch(console.error);

  };

  submitForm = async event => {
    event.preventDefault()
    const content = document.querySelector('.content').value
    this.comment(content, null);
  };

  // will be shown when the comment box is disabled
  disabledComponent = (props) => {

    return (
      <form className="pure-form pure-form-stacked" onSubmit={ this.onSubmitAuthorName }>
        <input
          type="text"
          className="pure-input-1 title"
          placeholder="Name"
          value={ this.state.authorName }
          onChange={ this.onChangeAuthorName }
        />
        <button type="submit" className="pure-button pure-button-primary">Submit</button>
      </form>
    );
  };

  render() {
      return (
          <div className="single">
              <div className="comments-wrapper">
                <CommentBox
                    disabled={ !this.state.authorNameIsSet }
                    getComments={ this.getComments }
                    normalizeComment={ this.normalizeComment }
                    comment={ this.comment }
                    disabledComponent={ this.disabledComponent }
                />
              </div>
          </div>
      );
  };
}

const mapDispatchToProps = dispatch => ({
  onSubmit: data => dispatch({ type: 'SUBMIT_COMMENT', data }),
});

//export default Comment;
export default connect(null, mapDispatchToProps)(Comment);
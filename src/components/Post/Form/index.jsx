import React from 'react';
import moment from 'moment';
import Dexie from 'dexie'
import { withRouter } from 'react-router-dom';

const db = new Dexie('SimpleBlog');
db.version(1).stores(
  { posts: "++id,title,content,date", comments: "++id,post_id,parent_id,content,author,avatar,date" }
)

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: '',
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
    }

    this.handleChangeField = this.handleChangeField.bind(this);
  }

  handleChangeField(key, event) {
    this.setState({
      [key]: event.target.value,
    });
  }

  submitForm = async event => {
    event.preventDefault()
    const title = document.querySelector('.title').value
    const content = document.querySelector('.content').value
    const date = moment().format("YYYY-MM-DD hh:mm:ss")
    await db.posts.add({
      title,
      content,
      date
    })
    this.props.history.push('/');
  }

  render() {
    const { title, content, date } = this.state;

    return (
      <div className="blog-post">
        <div className="pure-g">
          <div className="pure-u-1 shadow-sm">
            <form className="pure-form pure-form-stacked" onSubmit={event => this.submitForm(event)}>
              <fieldset>
                <legend>New Post</legend>
                <input type="text" name="title" className="pure-input-1 title" placeholder="Title" required="" onChange={(ev) => this.handleChangeField('title', ev)} value={title} />
                <textarea name="content" className="pure-input-1 content" placeholder="Content" required="" rows="10" onChange={(ev) => this.handleChangeField('content', ev)} value={content}></textarea>
                <input type="text" name="date" className="pure-input-1 date" placeholder="Date" readOnly value={date} />
                <button type="submit" className="pure-button pure-button-primary">Submit</button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Form);
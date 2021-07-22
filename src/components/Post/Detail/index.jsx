import React from 'react';
import moment from 'moment';
import {
  useParams
} from "react-router-dom";
import Dexie from 'dexie'
import { useLiveQuery } from "dexie-react-hooks";
import Comment from '../Comment';

const db = new Dexie('SimpleBlog');
db.version(1).stores(
  { posts: "++id,title,content,date", comments: "++id,post_id,parent_id,content,author,avatar,date" }
)

function Detail() {

  let {postId} = useParams();
  let id = parseInt(postId);

  const Item = useLiveQuery(() => db.posts.where('id').equals(id).toArray(), []);
  //const commentItems = useLiveQuery(() => db.comments.where('post_id').equals(id).toArray(), []);
  if (!Item) return null

  const postData = Item.map(({ id, title, content, date }) => (
    <div className="row" key={id}>
      <div className="blog-heading single">
        {title}
      </div>
      <div className="blog-date single">
        {moment(date).format("MMMM D, YYYY")}
      </div>
      <div className="blog-body single">
          <p>{content}</p>
      </div>
    </div>
  ))

  return (
    <div className="blog-post">
      {postData}
      <Comment 
      postId={id}
      ></Comment>
    </div>
  )
}

export default Detail;
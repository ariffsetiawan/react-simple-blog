import React from 'react';
import moment from 'moment';
import {
  useParams
} from "react-router-dom";
import Dexie from 'dexie'
import { useLiveQuery } from "dexie-react-hooks";

const db = new Dexie('SimpleBlog');
db.version(1).stores(
  { posts: "++id,title,content,date" }
)

function Detail() {

  let {postId} = useParams();
  let id = parseInt(postId);

  const Item = useLiveQuery(() => db.posts.where('id').equals(id).toArray(), []);
  if (!Item) return null

  const postData = Item.map(({ id, title, content, date }) => (
    <div className="row" key={id}>
      <div className="blog-heading">
        {title}
      </div>
      <div className="blog-date">
        {moment(date).format("MMMM D, YYYY")}
      </div>
      <div className="blog-body">
          <p>{content}</p>
      </div>
    </div>
  ))

  return (
    <div className="blog-post">
      {postData}
    </div>
  )
}

export default Detail;
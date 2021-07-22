import React, {useState, useEffect} from 'react'
import moment from 'moment';
import Dexie from 'dexie'
import ReactPaginate from 'react-paginate';

const db = new Dexie('SimpleBlog');
db.version(1).stores(
  { posts: "++id,title,content,date", comments: "++id,post_id,parent_id,content,author,avatar,date" }
)

function Home() {
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0)

  const getData = async() => {
    const data = await db.posts.reverse().toArray();

    const slice = data.slice(offset, offset + perPage)
    const postData = slice.map(pd => 
      <div className="row" key={pd.id}>
        <div className="blog-heading">
          <a href={'/post/'+pd.id}>{pd.title}</a>
        </div>
        <div className="blog-date">
          {moment(pd.date).format("MMMM D, YYYY")}
        </div>
        <div className="blog-body">
          <p>{pd.content}</p>
        </div>
      </div>)
    setData(postData)
    setPageCount(Math.ceil(data.length / perPage))
  }
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage * perPage)
  };

  useEffect(() => {
  getData()
  }, [offset])

  return (
    <div className="blog-post">
      <div className="nav" id="button-add">
        <a href="/add" className="pure-button pure-button-primary">Add New Post</a>
      </div>
      {data}
      <div className="pagination-wrapper">
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}/>
        </div>
    </div>
  );
}

export default Home;
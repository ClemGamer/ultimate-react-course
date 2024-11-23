import { useState } from "react";

const faqs = [
  {
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus.",
  },
  {
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus.",
  },
  {
    title: "Do you ship to countries outside the EU?",
    text: "Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!",
  },
];

export default function App() {
  return (
    <div>
      <Accordion data={faqs} />
    </div>
  );
}

function Accordion({ data }) {
  const [curOpen, setCurOpen] = useState(null);

  function handleToggleOpen(num) {
    setCurOpen(num === curOpen ? null : num);
  }

  return (
    <div className="accordion">
      {data.map((el, i) => (
        <AccordionItem
          key={el.title}
          num={i + 1}
          title={el.title}
          curOpen={curOpen}
          onClick={handleToggleOpen}
        >
          {el.text}
        </AccordionItem>
      ))}
    </div>
  );
}

/**
 *
 * @param {Object} props
 * @param {Number} props.num
 * @param {Object} props.item
 * @param {String} props.item.title
 * @param {String} props.item.text
 * @returns
 */
function AccordionItem({ children, num, title, curOpen, onClick }) {
  const isOpen = curOpen === num;

  return (
    <div
      className={`item ${isOpen ? "open" : ""}`}
      onClick={() => onClick(num)}
    >
      <p className="number">{String(num).padStart(2, "0")}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "﹣" : "﹢"}</p>
      {isOpen && <div className="content-box">{children}</div>}
    </div>
  );
}

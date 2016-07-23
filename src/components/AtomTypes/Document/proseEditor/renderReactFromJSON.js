import React from 'react';
import EmbedWrapper from './EmbedWrapper';

// const 
export const renderReactFromJSON = function(item) {
	if (!item) {return null;}

	return item.map((node, index)=>{
		switch (node.type) {
		case 'heading': 
			const id = node.content[0].text.replace(/\s/g, '-').toLowerCase();
			return React.createElement('h' + node.attrs.level, {key: index, id: id}, renderReactFromJSON(node.content));
		case 'blockquote':
			return <blockquote key={index}>{renderReactFromJSON(node.content)}</blockquote>;
		case 'ordered_list': 
			return <ol start={node.attrs.order === 1 ? null : node.attrs.oder} key={index}>{renderReactFromJSON(node.content)}</ol>;
		case 'bullet_list':
			return <ul key={index}>{renderReactFromJSON(node.content)}</ul>;
		case 'list_item':
			return <li key={index}>{renderReactFromJSON(node.content)}</li>;
		case 'horizontal_rule':
			return <hr key={index}/>;
		case 'code_block':
			return <pre key={index}><code>{renderReactFromJSON(node.content)}</code></pre>;
		case 'paragraph':
			return <div className={'p-block'} key={index}>{renderReactFromJSON(node.content)}</div>;
		case 'page_break':
			return <div className={'pagebreak'} key={index}>pagebreak</div>;
		case 'image':
			return <img {...node.attrs} key={index}/>;
		case 'hard_break':
			return <br key={index}/>;
		case 'text':
			const marks = node.marks || [];
			return marks.reduce((previous, current)=>{
				switch (current._) {
				case 'strong':
					return <strong key={index}>{previous}</strong>;
				case 'em':
					return <em key={index}>{previous}</em>;
				case 'code':
					return <code key={index}>{previous}</code>;
				case 'sub':
					return <sub key={index}>{previous}</sub>;
				case 'sup':
					return <sup key={index}>{previous}</sup>;
				case 's':
					return <s key={index}>{previous}</s>;
				case 'link':
					return <a href={current.href} title={current.title} key={index}>{previous}</a>;
				default: 
					return previous;
				}
			}, node.text);
		case 'embed':
			// console.log(node.attrs.data);
			return <EmbedWrapper {...node.attrs} key={index} citeCount={1}/>;
		default:
			console.log('Error with ', node);
		}
	});
};

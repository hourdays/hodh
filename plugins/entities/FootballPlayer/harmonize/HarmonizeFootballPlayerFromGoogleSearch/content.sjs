'use strict'

/*
* Create Content Plugin
*
* @param id         - the identifier returned by the collector
* @param options    - an object containing options. Options are sent from Java
*
* @return - your content
*/
function createContent(id, options) {
  let doc = cts.doc(id);

  let source;

  // for xml we need to use xpath
  if(doc && xdmp.nodeKind(doc) === 'element' && doc instanceof XMLDocument) {
    source = doc
  }
  // for json we need to return the instance
  else if(doc && doc instanceof Document) {
    source = fn.head(doc.root);
  }
  // for everything else
  else {
    source = doc;
  }

  return extractInstanceFootballPlayer(source);
}
  
/**
* Creates an object instance from some source document.
* @param source  A document or node that contains
*   data for populating a FootballPlayer
* @return An object with extracted data and
*   metadata about the instance.
*/
function extractInstanceFootballPlayer(source) {
  // the original source documents
  let attachments = source;
  // now check to see if we have XML or json, then create a node clone from the root of the instance
  if (source instanceof Element || source instanceof ObjectNode) {
    let instancePath = '/*:envelope/*:instance';
    if(source instanceof Element) {
      //make sure we grab content root only
      instancePath += '/node()[not(. instance of processing-instruction() or . instance of comment())]';
    }
    source = new NodeBuilder().addNode(fn.head(source.xpath(instancePath))).toNode();
  }
  else{
    source = new NodeBuilder().addNode(fn.head(source)).toNode();
  }
  let id = !fn.empty(fn.head(source.xpath('/id'))) ? xs.string(fn.head(fn.head(source.xpath('/id')))) : null;
  let name = !fn.empty(fn.head(source.xpath('/name'))) ? xs.string(fn.head(fn.head(source.xpath('/name')))) : null;
  let team = !fn.empty(fn.head(source.xpath('/team'))) ? xs.string(fn.head(fn.head(source.xpath('/team')))) : null;
  let position = !fn.empty(fn.head(source.xpath('/position'))) ? xs.string(fn.head(fn.head(source.xpath('/position')))) : null;
  let country = !fn.empty(fn.head(source.xpath('/country'))) ? xs.string(fn.head(fn.head(source.xpath('/country')))) : null;
  let age = !fn.empty(fn.head(source.xpath('/age'))) ? xs.string(fn.head(fn.head(source.xpath('/age')))) : null;

  // return the instance object
  return {
    '$attachments': attachments,
    '$type': 'FootballPlayer',
    '$version': '0.0.1',
    'id': id,
    'name': name,
    'team': team,
    'position': position,
    'country': country,
    'age': age
  }
};


function makeReferenceObject(type, ref) {
  return {
    '$type': type,
    '$ref': ref
  };
}

module.exports = {
  createContent: createContent
};


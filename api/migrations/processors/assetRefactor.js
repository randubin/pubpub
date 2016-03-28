import Asset from '../../models/asset-model.js'

function convertAsset(pub, asset) {

	const assetData ={
		filetype: asset.filetype,
		originalFilename: asset.originalFilename,
		thumbnail: asset.thumbnail,
		url: asset.url,
	};

	var assetModel = {
		assetType: asset.assetType,
		label: asset.refName,
		assetData: assetData,
		history: [{
			assetType:	asset.assetType,
			label:	asset.refName,
			assetData: assetData,
			updateDate: asset.createDate,
		}],

		usedInDiscussions: [],
		usedInPubs: [{
			id: pub._id,
			version: pub.history.length, //indexed one or not?
		}],

		parent: null,
		root: null,

		authors: [asset.owner], // Authors have edit access to the asset

		createDate: asset.createDate,
		lastUpdated: asset.createDate,
	};


	return assetModel;
}



/*
author: { type: ObjectId, ref: 'User' },
text: {type: String},
context: {type: String},
ancestorHash: {type: String},

endContainerPath: {type: String},
endOffset: {type: String},
startContainerPath: {type: String},
startOffset: {type: String},

pub: { type: ObjectId, ref: 'Pub' },
version: {type: String},

postDate: {type: String},
index: {type: Number},
usedInDiscussion: {type: Boolean},


*/

/*

assetType: 'highlight',
assetData: {
	text: {type: String},
	context: {type: String},
	ancestorHash: {type: String},

	endContainerPath: {type: String},
	endOffset: {type: String},
	startContainerPath: {type: String},
	startOffset: {type: String},

	sourcePub: { type: ObjectId, ref: 'Pub' },
	sourceVersion: {type: Number},
}

*/
function convertHighlight(discussion, selection) {

	const assetData = {
		text: selection.text,
		context: selection.context,
		ancestorHash: selection.ancestorHash,
		endContainerPath: selection.endContainerPath,
		endOffset: selection.endOffset,
		startContainerPath: selection.startContainerPath,
		startOffset: selection.startOffset,
		sourcePub: selection.pub._id,
		sourceVersion: selection.pub.version,
		index: selection.index,
	};

	const label = selection.text.substring(0,9);

	var assetModel = {
		_id: selection._id,
		assetType: 'highlight',
		label: label,
		assetData: assetData,
		history: [{
			assetType:	'highlight',
			label: label,
			assetData: assetData,
			updateDate: selection.postDate,
		}],

		usedInDiscussions: [{
			id: discussion._id,
			version: discussion.version || 1, // indexed one or not?
		}],
		usedInPubs: [],

		parent: null,
		root: null,

		authors: [discussion.owner], // Authors have edit access to the asset

		createDate: selection.postDate,
		lastUpdated: selection.postDate,
	};


	return assetModel;
}


function convertReference(pub, reference) {

	const assetData ={
		title: reference.title,
		url: reference.url,
		journal: reference.journal,
		volume: reference.volume,
		number: reference.number,
		pages: reference.pages,
		year: reference.year,
		publisher: reference.publisher,
		doi: reference.doi,
		note: reference.note,
	};

	var assetModel = {
		_id: reference._id,
		assetType: reference.assetType,
		label: reference.refName,
		assetData: assetData,
		history: [{
			assetType:	reference.assetType,
			label:	reference.refName,
			assetData: assetData,
			updateDate: reference.createDate,
		}],

		usedInDiscussions: [],
		usedInPubs: [{
			id: pub._id,
			version: pub.history.length, // indexed one or not?
		}],

		parent: null,
		root: null,
		authors: [reference.owner], // Authors have edit access to the asset
		createDate: reference.createDate,
		lastUpdated: reference.createDate,
	};


	return assetModel;
}

export function assetRefactorPub({pub, assets, references, callback}) {

	try {
		const assetModels = assets.map((asset) => convertAsset(pub, asset));
		const referenceModels = references.map((reference) => convertReference(pub, reference));
		const insertModels = assetModels.concat(referenceModels);

		// callback(null, insertModels);

		Asset.create(insertModels, function(err, assets) {
			if (err) return callback(err);
			return callback(null, assets);
		});

	} catch (err1) {
		callback(err1);
	}
}


export function assetRefactorDiscussion({discussion, highlights, callback}) {

	try {
		const highlightModels = highlights.map((highlight) => convertHighlight(discussion, highlight));

		// callback(null, insertModels);
		// console.log('highlights', highlightModels);

		Asset.create(highlightModels, function(err, assets) {
			if (err) return callback(err, assets);
			return callback(null, assets);
		});

	} catch (err1) {
		callback(err1);
	}
}

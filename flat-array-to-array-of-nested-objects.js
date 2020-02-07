const flatArrayToNested = (function () {
    const _store = {
        processed: [],
        endResult: [],
        parentField: '',
        groupingField: ''
    };

    function _pushDistinct(arr, item) {
        if (arr.indexOf(item) === -1) {arr.push(item);}
    }

    function _getChildItems(inArray, currentItem) {
        let items = inArray.filter(x => x[_store.groupingField] === currentItem[_store.parentField] && x[_store.groupingField] !== x[_store.parentField]);

        _pushDistinct(_store.processed, currentItem[_store.parentField]);

        if (items.length === 0) {
            _pushDistinct(_store.endResult, currentItem);
            return;
        }

        for (let i = 0; i < items.length; i++) {
            _pushDistinct(_store.processed, items[i][_store.parentField]);
        }

        currentItem.Children = items;
        _pushDistinct(_store.endResult, currentItem);
        _getChildItems(items, items[0]);
    }

    function convert(arr, parentField, groupingField) {
        _store.parentField = parentField;
        _store.groupingField = groupingField;
        for (let i = 0; i < arr.length; i++) {
            let currentItem = arr[i];
            _getChildItems(arr, currentItem);
        }

        let remove = _store.endResult
            .filter(value => _store.processed.includes(value[_store.groupingField]) && !(value[_store.groupingField] === value[_store.parentField]));
        
        for (let i = 0; i < remove.length; i++) {
            let currentItem = remove[i];
            let idx = _store.endResult.indexOf(currentItem);
            if( idx !== -1){
                _store.endResult.splice(idx, 1);
            }
        }

        return _store.endResult;
    }

    return {
        convert: convert,
    };
})();

// noinspection JSUnresolvedVariable
module.exports = {
    array: flatArrayToNested
};


import PropTypes from 'prop-types';
import React from 'react';
import InlineSVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as CollectionsActions from '../../actions/collections';
import getSortedCollections from '../../selectors/collections';

import exitUrl from '../../../../images/exit.svg';

import { Searchbar } from '../Searchbar';
import Item from './Item';

// const reducer = () => {
//   switch ()
//   case 'noItems':
//     return 'NoCollections';
//   case
// }

const NoCollections = () => (
  <div>
    <p>No collections</p>
    {/* <p>
      <Link
        to="/andrewn/collections/create"
        className="searchbar__clear-button"
        onClick={() => {}}
      >Create
      </Link>
    </p> */}
  </div>);

const projectInCollection = (project, collection) => (
  collection.items.find(item => item.project.id === project.id) != null
);


const CollectionPopover = ({
  onClose, project, collections, addToCollection, removeFromCollection, getCollections, user
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const filteredCollections = searchTerm === '' ?
    collections :
    collections.filter(({ name }) => name.toUpperCase().includes(searchTerm.toUpperCase()));

  React.useEffect(() => {
    getCollections(user.username);
  }, [user]);

  const handleAddToCollection = (collectionId) => {
    addToCollection(collectionId, project.id);
  };

  const handleRemoveFromCollection = (collectionId) => {
    removeFromCollection(collectionId, project.id);
  };

  return (
    <div className="collection-popover">
      <div className="collection-popover__header">
        <h4>Add to collection</h4>
        <button className="collection-popover__exit-button" onClick={onClose}>
          <InlineSVG src={exitUrl} alt="Close Add to Collection" />
        </button>
      </div>

      <div className="collection-popover__filter">
        <Searchbar searchLabel="Search collections..." searchTerm={searchTerm} setSearchTerm={setSearchTerm} resetSearchTerm={() => setSearchTerm('')} />
      </div>

      <div className="collection-popover__items">
        <ul>
          {
            filteredCollections.map((collection) => {
              const inCollection = projectInCollection(project, collection);
              const handleSelect = inCollection ? handleRemoveFromCollection : handleAddToCollection;

              return (
                <Item inCollection={inCollection} key={collection.id} collection={collection} onSelect={() => handleSelect(collection.id)} />
              );
            })
          }
        </ul>
      </div>
    </div>
  );
};

CollectionPopover.propTypes = {
  onClose: PropTypes.func.isRequired,
  getCollections: PropTypes.func.isRequired,
  addToCollection: PropTypes.func.isRequired,
  removeFromCollection: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  collections: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  project: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    collections: getSortedCollections(state),
    loading: state.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, CollectionsActions),
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionPopover);
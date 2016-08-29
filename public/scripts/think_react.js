
var ProductCategoryRow = React.createClass({
  render: function() {
    return (<tr><th colSpan="2">{this.props.category}</th></tr>);
  }
});

var ProductRow = React.createClass({
  render: function() {
    var name = this.props.product.stocked ?
      this.props.product.name :
      <span style={{color: 'red'}}>
        {this.props.product.name}
      </span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.product.price}</td>
      </tr>
    );
  }
});

var ProductTable = React.createClass({
  render: function() {
    var rows = [];
    var lastCategory = null;
    this.props.products.forEach(function(product) {
      if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    }.bind(this));
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
      this.refs.inStockOnlyInput.checked
    );
  },
  render: function() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            ref="inStockOnlyInput"
            onChange={this.handleChange}
          />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
});

var AddProduct = React.createClass({
  getInitialState: function() {
    return {category: '', price: '', stocked: '', name: ''};
  },
  handleCategoryChange: function(e) {
    this.setState({category: e.target.value});
  },
  handleStockedChange: function(e) {
    this.setState({stocked: e.target.value});
  },
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handlePriceChange: function(e) {
    this.setState({price: e.target.value});
  },
  handleSubmit: function(e) {
    // console.log("hit");
    e.preventDefault();
    var category = this.state.category.trim();
    var price = this.state.price.trim();
    var stocked = this.state.stocked.trim();
    var name = this.state.name.trim();
    if (!category || !price) {
      return;
    }
    this.props.products.push({category: category, price: price, stocked: stocked, name: name});
    this.state.products.push({category: category, price: price, stocked: stocked, name: name});
    this.props.onCategorySubmit({category: category, price: price, stocked: stocked, name: name});

    // console.log(this.props.products)
    this.setState({category: '', price: '', stocked: '', name: ''});

  },
  render: function() {
    return (
      <form className="productForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Category"
          value={this.state.category}
          onChange={this.handleCategoryChange}
        />
        <input
          type="number"
          placeholder="Price"
          value={this.state.price}
          onChange={this.handlePriceChange}
        />
        <input
          type="text"
          placeholder="stocked"
          value={this.state.stocked}
          onChange={this.handleStockedChange}
        />
        <input
          type="text"
          placeholder="name"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <input type="submit" value="Add" />
      </form>
    );
  }
});

var FilterableProductTable = React.createClass({
  getInitialState: function() {
    return {
      filterText: '',
      inStockOnly: false
    };
  },

  handleUserInput: function(filterText, inStockOnly) {
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  },

  render: function() {
    return (
      <div>
      <AddProduct products={this.props.products}/>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
});


var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS} />,
  document.getElementById('container')
);

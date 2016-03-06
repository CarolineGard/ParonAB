
Products = new Mongo.Collection("products");

//OPtions for all routes within the project
Router.configure ({
  layoutTemplate: 'main'
});

Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/form_in', {
  name: 'form_in',
  template: 'form_in'
});

Router.route('/form_out', {
  name: 'form_out',
  template: 'form_out'
});

Router.route('/show_products', {
  name: 'show_products',
  template: 'show_products'
});


//Code only runs on the client
if (Meteor.isClient) {

  Template.show_products.helpers ({
    
    'product': function () {
      return Products.find();
    }
  });

  Template.home.helpers ({

    'showSelectedProduct' : function () {
      var selectedProduct = Session.get('selectedProduct');
      return Products.findOne(selectedProduct);
    },

    'showSelectedLocation' : function () {
      var selectedLocation = Session.get('selectedLocation');
      return Products.findOne(selectedLocation);
    }
  });

  Template.drop_down1.events ({
    'change select' : function (event,template) {
      Session.set("selectedProduct", event.target.value);
      console.log(event);
    }
  });

  Template.drop_down2.events ({
    'change select' : function (event,template) {
      Session.set("selectedLocation", event.target.value);
      console.log(event);
    }
  });

  Template.form_in.events ({
    //When clicking the submit button
    'submit form': function(event) {
      //prevent the browser's default behavior of the event from occurring
      event.preventDefault();

      var productName = Session.get('selectedProduct');
      var locationName = Session.get('selectedLocation');
      var nr_products = parseInt(event.target.nr_products.value);
      
      var changingProduct = Products.findOne({name: productName, location: locationName});

      //Update the quantity
      if (changingProduct) {
        Products.update(changingProduct._id, {$inc: {quantity: nr_products}});
      }
      else {
        //No product like this!!!
        //Warning
      }
    }
  });

  Template.form_out.events ({
    //When clicking the submit button
    'submit form': function(event) {
      //prevent the browser's default behavior of the event from occurring
      event.preventDefault();

      var productName = Session.get('selectedProduct');
      var locationName = Session.get('selectedLocation');
      var nr_products = parseInt(event.target.nr_products.value);
      
      var changingProduct = Products.findOne({name: productName, location: locationName});

      //Update the quantity
      if (changingProduct) {
        Products.update(changingProduct._id, {$inc: {quantity: -nr_products}});
        return true;
      }
      else {
        //No product like this!!!
        //Warning
        return false;
      }
    }
  });


   Template.drop_down1.helpers ({
    'product': function () {
      var myArray = Products.find().fetch();
      var distinctArray = _.uniq(myArray, false, function(d) {return d.name});
      var distinctValues = _.pluck(distinctArray, 'name');

      return distinctValues;
    },

    'setDefault': function () {
      Session.set("selectedProduct", distinctValues[0]);
    }
  });

  Template.drop_down2.helpers ({
    'product': function () {
      var myArray = Products.find().fetch();
      var distinctArray = _.uniq(myArray, false, function(d) {return d.location});
      var distinctValues = _.pluck(distinctArray, 'location');

      return distinctValues;
    },

    'setDefault': function () {
      Session.set("selectedLocation", distinctValues[0]);
    },
  });


  Template.body.events ({
    "click #btn-status": function() {
      //Show the inventory status
    },

    'submit .new-report-in': function () {
      //Prevent default browser form submit
      event.preventDefault();

      //Get value from text element
      var text = event.target.nr_products.value;

      //Get value from drop downs
      //var product = event.target.

      //Clear form
      event.target.nr_products.value = "";


    }
    //Obs provar för framtiden från meteortips.com/first-meteor-tutorial/databases-part-2/
    // "click submit" : function () {
    //   var selectedProduct = Session.get('selectedProduct');
    //   Products.update(selectedProduct, {set: });
    // },

    // "submit .new-task": function (event) {
    //   //Prevent default browser form submit
    //   event.preventDefault();


    //   //Get value from element
    //   var text = event.target.text.value;

    //   //insert a task into the collection
    //   Tasks.insert({
    //     text: text, createdAt: new Date()
    //   });

    //   //Clear form
    //   event.target.text.value = "";
    // }
  //});
   });
}




if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

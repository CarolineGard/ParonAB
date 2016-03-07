
//New MongoDB collection. Stores all product data
Products = new Mongo.Collection("products");

//Options for all routes within the project
Router.configure ({
  layoutTemplate: 'main'
});

Router.route('/', {
  name: 'home',
  template: 'home'
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

  Template.home.helpers ({
    //Get selected product in drop down 1
    'showSelectedProduct' : function () {
      var selectedProduct = Session.get('selectedProduct');
      return selectedProduct;
    },
    //Get selected product in drop down 2
    'showSelectedLocation' : function () {
      var selectedLocation = Session.get('selectedLocation');
      return selectedLocation;
    },
    //Get selected radio button
    'showSelectedRadio' : function () {
      var selectedRadio = Session.get('selectedRadio');

      //Returns false for -1 (out), true for 1 (in)
      if (selectedRadio == -1) 
        return false; 
      
      else if (selectedRadio == 1)
        return true;

      else 
        return true;
    }
  });


  Template.drop_down1.helpers ({
    //Drop down for products without repetitions
    'product': function () {
      var myArray = Products.find().fetch();
      var distinctArray = _.uniq(myArray, false, function(d) {return d.name});
      var distinctValues = _.pluck(distinctArray, 'name');

      return distinctValues;
    }
  });

  Template.drop_down2.helpers ({
    //Drop down for location without repetitions
    'product': function () {
      var myArray = Products.find().fetch();
      var distinctArray = _.uniq(myArray, false, function(d) {return d.location});
      var distinctValues = _.pluck(distinctArray, 'location');

      return distinctValues;
    }
  });

  //Returns objects from Collection Products for table 
  Template.show_products.helpers ({
    'product': function () {
      return Products.find();
    }
  });

  Template.drop_down1.events ({
    'change select' : function (event,template) {
      //Create a session for the selected product in drop down 1
      Session.set("selectedProduct", event.target.value);
    }
  });

  Template.drop_down2.events ({
    'change select' : function (event,template) {
      //Create a session for the selected location in drop down 2
      Session.set("selectedLocation", event.target.value);
    }
  });

  Template.home.events ({
    'change .radios' : function(e) {      
      var clickedRadio = e.currentTarget;
      console.log($(clickedRadio).val());
      
      //Create a session for the selected radio button
      Session.set("selctedRadio", $(clickedRadio).val());
    }
  });

  Template.form_in.events ({
    //When clicking the submit button
    'submit form': function(event, template) {
      //prevent the browser's default behavior of the event from occurring
      event.preventDefault();

      var productName = Session.get('selectedProduct');
      var locationName = Session.get('selectedLocation');
      var nr_products = parseInt(event.target.nr_products.value);
      
      //Find which object to update
      var changingProduct = Products.findOne({name: productName, location: locationName});

      //Update the quantity
      if (changingProduct && nr_products) {
        Products.update(changingProduct._id, {$inc: {quantity: nr_products}});
        swal("Inleverans rapporterad!", ""+nr_products+" st "+productName+" tillagda i lager "+locationName);
        event.target.nr_products.value = "";
      }
      else {
        swal("Kunde inte rapportera leverans!", "Alla fällt måste vara korrekt ifyllda.");
      }
    }
  });

  Template.form_out.events ({
    //When clicking the submit button
    'submit form': function(event, template) {
      //prevent the browser's default behavior of the event from occurring
      event.preventDefault();

      var productName = Session.get('selectedProduct');
      var locationName = Session.get('selectedLocation');
      var nr_products = parseInt(event.target.nr_products.value);
      
      //Find which object to update
      var changingProduct = Products.findOne({name: productName, location: locationName});

      //Update the quantity for the object
      //Check if all form fields are complete
      if (changingProduct && nr_products) {
        //Test if the updated quantity < 0 
        if ( (Products.findOne(changingProduct._id).quantity - nr_products) < 0 ) {
          swal("Kunde inte rapportera leverans!", "Det finns inte tillräckligt många varor i lager"); 
        }
        else {
          Products.update(changingProduct._id, {$inc: {quantity: -nr_products}});

          swal("Utleverans rapporterad!", ""+nr_products+" st "+productName+" borttagna från lager "+locationName);
          event.target.nr_products.value = "";
        }
      }
      else {
        swal("Kunde inte rapportera leverans!", "Alla fällt måste vara korrekt ifyllda.");
      }
    }
  });
 }

//Code only runs on the server
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

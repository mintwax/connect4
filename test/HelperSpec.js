"use strict";

beforeEach(function () {
  jasmine.addMatchers({

    hasRackEqualTo: function () {

      return {

        compare: function(actual, expected) {

          var result =  { pass: true, message: "Passed" };
          expect(actual.constructor.name).toEqual('Connect4');
          expect(expected.constructor.name).toEqual('Connect4');

          result.pass = actual.rack.length == expected.rack.length;
          if (!result.pass) {
            result.message = "Expected rack size of " + expected.rack.length + " but got " + actual.rack.length;
            return result;
          }

          for(let i=0; i<actual.rack.length; i++) {
            for (let j=0; j <actual.rack[i].length; j++) {
              if (actual.rack[i][j] != expected.rack[i][j]) {
                result.pass = false;
                result.message = "actual.rack[" + i + "][" + j + "] = " + actual.rack[i][j] + " ";
                result.message += "expected.rack[" + i + "][" + j + "] = " + expected.rack[i][j];
                return result;
              }
            }
          }

          return result;

        }
      };
    }, // hasRackEqualTo


    hasPositionsEqualTo: function () {

      return {

        compare: function(actual, expected) {

          var result =  { pass: true, message: "Passed" };
          expect(actual.constructor.name).toEqual('Array');
          expect(expected.constructor.name).toEqual('Array');

          result.pass = actual.length == expected.length;
          if (!result.pass) {
            result.message = "Expected size of " + expected.length + " but got " + actual.length;
            return result;
          }

          for(let i=0; i<actual.length; i++) {
              if (actual[i].column != expected[i].column &&
                  actual[i].row != expected[i].row) {
                result.pass = false;
                result.message = "At index " + i + " ";
                result.message += "actual = (" + actual[i].column + ", " + actual[i].row + ") ";
                result.message += "expected = (" + expected[i].column + ", " + expected[i].row + ")";
                return result;
              }
          }


          return result;

        }
      };
    }// hasPositionsEqualTo

  });
});


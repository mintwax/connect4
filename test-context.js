var context = require.context('./test', true, /Spec\.js$/);
context.keys().forEach(context);
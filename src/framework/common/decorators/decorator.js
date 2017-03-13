// @flow

export type Descriptor = {
  enumerable: boolean,
  writable: boolean,
  configurable: boolean,
  value: any,
};

export type MethodDecoratorArgument = {
  target: Function,
  key: string,
  descriptor: Descriptor,
  options: Array<any>,
};

export type ClassDecoratorArgument = {
  target: Function,
  options: Array<any>,
};

export function methodDecorator(logicHandler: (arg: MethodDecoratorArgument) => Descriptor) {

  return function methodDecoratorWrapper(...decorateeOrOptions) {
    if (isDecoratedMethod(decorateeOrOptions)) {
      return logicHandler({
        target: decorateeOrOptions[0],
        key: decorateeOrOptions[1],
        descriptor: decorateeOrOptions[2],
        options: [],
      });
    }

    const options = decorateeOrOptions;
    return function methodDecoratorWithOptionsWrapper(...decoratee) {
      if (!isDecoratedMethod(decoratee)) {
        throw new TypeError(`Rejected decorator syntax "@${logicHandler.name}()()", only one parenthesis set is allowed at most.`);
      }

      return logicHandler({
        target: decoratee[0],
        key: decoratee[1],
        descriptor: decoratee[2],
        options,
      });
    };
  };
}

export function classDecorator(logicHandler: (arg: ClassDecoratorArgument) => Function): Function {
  return function methodDecoratorWrapper(...decorateeOrOptions) {
    if (isDecoratedClass(decorateeOrOptions)) {
      return logicHandler({
        target: decorateeOrOptions[0],
        options: [],
      });
    }

    const options = decorateeOrOptions;
    return function methodDecoratorWithOptionsWrapper(...decoratee) {
      if (!isDecoratedClass(decoratee)) {
        throw new TypeError(`Rejected decorator syntax "@${logicHandler.name}()()", only one parenthesis set is allowed at most.`);
      }

      return logicHandler({
        target: decoratee[0],
        options,
      });
    };
  };
}

export function isDecoratedClass(args) {
  return Array.isArray(args)
    && args[0] instanceof Function;
}

export function isDecoratedMethod(args) {
  return Array.isArray(args)
    && args[0] instanceof Function
    && typeof args[1] === 'string'
    && typeof args[2] === 'object'
    && args[2] !== null;
}

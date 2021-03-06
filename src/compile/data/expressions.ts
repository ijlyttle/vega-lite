import {parse} from 'vega-expression';
import {StringSet} from './../../util';

function getName(node: any) {
  let name: string[] = [];

  if (node.type === 'Identifier') {
    return [node.name];
  }

  if (node.type === 'Literal') {
    return [node.value];
  }

  if (node.type === 'MemberExpression') {
    name = name.concat(getName(node.object));
    name = name.concat(getName(node.property));
  }

  return name;
}

function startsWithDatum(node: any): boolean {
  if (node.object.type === 'MemberExpression') {
    return startsWithDatum(node.object);
  }
  return node.object.name === 'datum';
}

export function getDependentFields(expression: string) {
  const ast = parse(expression);
  const dependents: StringSet = {};
  ast.visit((node: any) => {
    if (node.type === 'MemberExpression' && startsWithDatum(node)) {
      dependents[
        getName(node)
          .slice(1)
          .join('.')
      ] = true;
    }
  });

  return dependents;
}

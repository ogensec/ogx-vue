export const getParentComponentWithName = function(instance: any, componentName: any) {
  let component = null
  let parent = instance.parent
  while (parent && !component) {
    if (parent.type.name === componentName) {
      component = parent
    }
    parent = parent.parent
  }
  return component
}
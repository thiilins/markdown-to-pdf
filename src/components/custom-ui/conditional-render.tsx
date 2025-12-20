export const ConditionalRender = ({
  children,
  condition,
}: {
  children: React.ReactNode | React.ReactNode[]
  condition: boolean
}) => {
  return condition ? <>{children}</> : null
}

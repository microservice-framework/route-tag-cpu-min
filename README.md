# route-tag-cpu-min
Provide tag "cpu-min". Easy to use tag that vote to route traffic to minimum loaded cpu


Example config: 
```
{
  tag: "cpu-min",
  config: {
    voteSize: 10,
  },
  handler: "route-tag-cpu-min"
}
```

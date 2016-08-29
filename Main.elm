import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.App exposing (beginnerProgram)

main =
    beginnerProgram 
        { model = model
        , view = view
        , update = update
        }

-- Model

model =
    { beans = ["Lima", "Kidney", "Soy"]
    , csn = "csn då"
    , inputBean = ""
    }

-- Update
type Msg = AddBean | InputBean String

update msg model = 
    case msg of
        AddBean -> 
            addBean model.inputBean model
        InputBean bean ->
            { model | inputBean = bean }

addBean bean model = 
    case bean of
        "" -> model
        _  -> 
            { model
            | beans = model.inputBean::model.beans
            , inputBean = ""
            }

-- View

(=>) = (,)

view model = 
    div [beanStyle]
    [ header
    , beanUl model
    , importantQuestionHeader
    , addBeanInput model
    , addBeanButton
    , footer
    ]

header =
    h1 [] [text "All the known beans:"]

importantQuestionHeader = 
    h2 [] [text "Know of any other beans?"]

beanUl model = 
    let 
        beans = List.map beanItem model.beans
    in
        ul [style ["list-style-type" => "none"]]
        beans

footer =
    h6 [] [text model.csn]

addBeanButton = 
    button [onClick AddBean] [text "Add Bean!"]

addBeanInput model =
    input 
        [ placeholder "Bean Name"
        , onInput InputBean
        , value model.inputBean
        ]
        []

beanItem name = li [] [text name]

beanStyle = 
    style 
        [ "text-align" => "center"
        , "font-family" => "sans-serif" 
        ]

